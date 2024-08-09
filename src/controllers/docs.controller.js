import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Doc } from "../models/docs.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createDoc = asyncHandler(async (req, res, next) => {
  const { title, docContent, userId } = req.body;
  try {
    const user = await User.findById(userId);

    // Create a new Docs document
    const newDoc = new Doc({
      title: title,
      content: docContent,
      isPublished: true,
      archived: false,
      private: false,
      // location:"everything"
      owner: user._id,
    });
    await newDoc.save();

    // Find the user by ID and add the new Docs document reference to their docs array

    user.docs.push(newDoc._id);
    await user.save();

    res.send(
      new ApiResponse(
        200,
        newDoc,
        "Docs created and added to user successfully"
      )
    );
  } catch (error) {
    res.send(
      new ApiError(500, "Error creating Docs and adding to user", error)
    );
  }
});

const getUserDocs = asyncHandler(async (req, res, next) => {
  const params = req.params;
  const filterParam = req.query.filter;

  try {
    // Find the user by ID and populate the docs array with the actual Docs documents
    const user = await User.findById(params.userId).populate("docs");
    if (!user) {
      res.send(new ApiResponse(404, {}, "User not found!"));
    } else {
      const filterData = user.docs.filter((doc) => doc[filterParam] != false);
      res.send(
        new ApiResponse(200, filterData, "Document Retrieved succesfully")
      );
    }
  } catch (error) {
    res.send(
      new ApiError(500, "error fecting user docs", [error], error.stack)
    );
  }
});

const deleteDoc = asyncHandler(async (req, res, next) => {
  const { docIds, userId } = req.body;
  try {
    // Delete the Docs document by its IDa
    if (docIds.length == 1) {
      const deletedDoc = await Doc.findByIdAndDelete(docIds[0]);

      if (!deletedDoc) {
        res.send(
          new ApiResponse(
            404,
            {},
            `couldn't find document with id:${docIds[0]}`
          )
        );
      } else {
        // Find the user by ID and update their docs array by removing the reference
        await User.findByIdAndUpdate(userId, { $pull: { docs: docIds[0] } });
        res.send(
          new ApiResponse(
            200,
            deletedDoc,
            "Document deleted and reference removed from user"
          )
        );
      }
    } else {
      const deletedDoc = await Doc.deleteMany({ _id: { $in: docIds } });

      if (!deletedDoc) {
        res.send(
          new ApiResponse(
            404,
            {},
            `couldn't find document with id:${docIds.join(",")}`
          )
        );
      } else {
        // Find the user by ID and update their docs array by removing the reference
        await User.updateMany(
          { docs: { $in: docIds } }, // Assuming you have a reference to the document in the User model
          { $set: { status: "deleted" } } // Or any other field to update
        );

        res.send(
          new ApiResponse(
            200,
            deletedDoc,
            "Document deleted and reference removed from user"
          )
        );
      }
    }
  } catch (error) {
    res.send(new ApiError(500, "Error deleteing document", error));
  }
});
const updateDocSetting = asyncHandler(async (req, res, next) => {
  const { docIds, updateData } = req.body;

  try {
    if (docIds.length == 1) {
      const doc = await Doc.findByIdAndUpdate(docIds[0], updateData, {
        new: true,
      });
      if (!doc) {
        res.send(
          new ApiResponse(
            404,
            {},
            `couldn't find document with id:${docIds[0]}`
          )
        );
      } else {
        res.send(
          new ApiResponse(200, doc, `updated the document with id:${docIds[0]}`)
        );
      }
    } else {
      const doc = await Doc.updateMany({ _id: { $in: docIds } }, updateData, {
        new: true,
      });
      if (!doc) {
        res.send(
          new ApiResponse(
            404,
            {},
            `couldn't find document with ids:${docIds.join(",")}`
          )
        );
      } else {
        res.send(
          new ApiResponse(
            200,
            doc,
            `updated the document with ids:${docIds.join(",")}`
          )
        );
      }
    }
  } catch (error) {
    res.send(new ApiError(500, "Error updating document", error));
  }
});

export { createDoc, getUserDocs, deleteDoc, updateDocSetting };
