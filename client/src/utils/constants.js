import { ERROR, SUCCESS } from "../constants";
import { useState, useEffect } from "react";

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export const arrayChunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

export const processImage = (
  e,
  setFormData,
  formData,

  dispatch
) => {
  // get the files
  let files = e.target.files;

  for (var i = 0; i < files.length; i++) {
    let file = files[i];

    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      let fileInfo = {
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1000) + " kB",
        base64: reader.result,
        file: file,
      };
// console.log(fileInfo.type);
      if (fileInfo.type !== "image/jpeg" && fileInfo.type !== "image/png") {
        dispatch({ type: ERROR, payload: "Invalid File Type" });
        return;
      }

      setFormData({ ...formData, file: fileInfo.base64 });
    }; // reader.onload
  } // for
  dispatch({ type: SUCCESS, payload: "Successfully uploaded file" });

};


