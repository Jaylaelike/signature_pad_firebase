import "./App.css";
import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase-config";
import { v4 } from "uuid";
import SignaturePad from "signature_pad";
import "firebase/firestore";

function App() {
  const [imageUrls, setImageUrls] = useState([]);
  const imagesListRef = ref(storage, "images/");
  const signaturePadRef = useRef(null);

  const uploadSignature = () => {
    if (!signaturePadRef.current) return;
    const signatureDataURL = signaturePadRef.current.toDataURL();
    const imageRef = ref(storage, `images/${v4()}.png`);
    uploadBytes(imageRef, dataURLtoBlob(signatureDataURL))
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrls((prev) => [...prev, url]);
          console.log(imageUrls);
        });
      })
      .then(clearSignature());
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const clearSignature = () => {
    if (!signaturePadRef.current) return;
    const signaturePad = new SignaturePad(signaturePadRef.current);
    signaturePad.clear();
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
          console.log(imageUrls);
        });
      });
    });
  }, []);

  useEffect(() => {
    const signaturePad = new SignaturePad(signaturePadRef.current);
    return () => {
      signaturePad.off();
      signaturePad.clear();
    };
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <canvas
          ref={signaturePadRef}
          width={400}
          height={200}
          style={{ border: "1px solid black" }}
        />
      </div>
      <br />
      <div className="flex justify-center">
        <button onClick={uploadSignature}>Upload Signature</button>
        <button onClick={clearSignature}>Clear</button>
      </div>

      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt="Signature" width={200} height={200} />
      ))}
    </>
  );
}

export default App;

// const [imageUpload, setImageUpload] = useState(null);
//   const [imageUrls, setImageUrls] = useState([]);

//   const imagesListRef = ref(storage, "images/");
//   const uploadFile = () => {
//     if (imageUpload == null) return;
//     const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
//     uploadBytes(imageRef, imageUpload).then((snapshot) => {
//       getDownloadURL(snapshot.ref).then((url) => {
//         setImageUrls((prev) => [...prev, url]);
//       });
//     });
//   };

//   useEffect(() => {
//     listAll(imagesListRef).then((response) => {
//       response.items.forEach((item) => {
//         getDownloadURL(item).then((url) => {
//           setImageUrls((prev) => [...prev, url]);
//           console.log(imageUrls);
//         });
//       });
//     });
//   }, []);

//   return (
//     <div className="App">
//       <input
//         type="file"
//         onChange={(event) => {
//           setImageUpload(event.target.files[0]);
//         }}
//       />
//       <button onClick={uploadFile}> Upload Image</button>
//       {imageUrls.map((url) => {
//         // eslint-disable-next-line react/jsx-key
//         return <img src={url} width={200} height={200} />;
//       })}
//     </div>
//   );
