import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter : multer.Options["fileFilter"] = (
    _req,
    file,
    callback,
) => {
    if(file.mimetype != "application/pdf") {
        callback(new Error("Only pdf files are allowed."));
        return;
    }

    callback(null, true);
};

export const resumeUpload = multer({
    storage,
    fileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024,
        files : 1,
    },
});