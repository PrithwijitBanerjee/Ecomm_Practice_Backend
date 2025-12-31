import fs from "node:fs";
import path from "node:path";

export const unlinkFile = (filePath, folderName) => {
    const basefilename = path.basename(filePath);
    fs.unlink(path.join(process.cwd(), "public", folderName, basefilename), (error) => {
        if(error) {
            throw new Error(error);
        } else {
            return true;
        }
    });
};