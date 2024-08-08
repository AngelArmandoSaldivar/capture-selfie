// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import ReactCrop from 'react-image-crop';
// import Webcam from 'react-webcam';

// import 'react-image-crop/dist/ReactCrop.css';

// import 'react-image-crop/dist/ReactCrop.css';
// import { v4 as uuidv4 } from 'uuid';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardHeader from '@mui/material/CardHeader';
// import Avatar from '@mui/material/Avatar';
// import IconButton, { IconButtonProps } from '@mui/material/IconButton';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { styled } from '@mui/material/styles';
// import CameraIcon from '@mui/icons-material/Camera';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';//Siguiente
// import ContentCutIcon from '@mui/icons-material/ContentCut'; //Tijeras
// import ReplayIcon from '@mui/icons-material/Replay'; //Volver
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';//Check Continuar
// import ovalImage from '../img/contorno1.png';

// const ImageCropper = () => {

//   const [upImg, setUpImg] = useState();
//   const imgRef = useRef(null);  
//   const webcamRef = useRef(null);    
//   const [show, setShow] = useState(true);
//   const [show2, setShow2] = useState(false);
//   const [show3, setShow3] = useState(false);
//   const [show4, setShow4] = useState(false);
//   const [dataSelfie, setDataSelfie] = useState([]);
//   const [selfieCrop, setSelfieCrop] = useState({ unit: '%', x: 27, y: 10, width: 50, height: 80, aspect: 3 / 4 });
//   const [crop, setCrop] = useState({ unit: '%', x: 20, y: 30, width: 75, height: 40, aspect: 3 / 2 });  const [croppedImage, setCroppedImage] = useState('null');
//   const [showOverlay, setShowOverlay] = useState(true);
//   const [src, setSrc] = useState(null);
//   const [cropWidth, setCropWidth] = useState('');
//   const [cropHeight, setCropHeight] = useState('');
//   const [cropX, setCropX] = useState('');
//   const [cropY, setCropY] = useState('');
//   const [token, setToken] = useState(null);
//   const [carga, setCarga] = useState('');

//   //VARIABLES DE ENTORNO
//   const clientId = process.env.CLIENT_ID;
//   const clientSecret = process.env.CLIENT_SECRET;


//   const onSelectFile = useCallback((e) => {
//     if (webcamRef.current.getScreenshot()) {
//       setCrop({ unit: '%', x: 20, y: 30, width: 60, height: 40, aspect: 3 / 2 }); 
//       const reader = new FileReader();      
//       setSrc(webcamRef.current.getScreenshot());
//       setUpImg(webcamRef.current.getScreenshot());

//       const fileDetail = [
//         '',
//         new Uint8Array([10]),
//         new Uint32Array([2]),
//       ];
//       const file = new File(
//       [fileDetail], 'file.png',
//       {lastModified: new Date(2022, 0, 5), type: ''});
//       reader.readAsDataURL(file);
//       setShow(!show);
//       setShow2(!show2);
//       setShowOverlay(false);
//     }
//   }, [webcamRef]);

//   const onLoad = useCallback((img) => {
//     imgRef.current = img;
//   }, []);  

//   const onCropComplete = (crop) => {    
//     setCropX(crop.x);
//     setCropY(crop.y);
//     setCropWidth(crop.width);
//     setCropHeight(crop.height);    
//   };

//   var makeClientCrop = async (crop) => {
//     if (src && cropWidth && cropHeight) {
//       crop.width = cropWidth;
//       crop.height = cropHeight;  
//       crop.x = cropX;
//       crop.y = cropY;    
//       const croppedImageUrl = await getCroppedImg(src, crop);
//       setCroppedImage(croppedImageUrl);
//     }
//   }; 

//   const getCroppedImg = (src, crop) => {
//     return new Promise((resolve, reject) => {
//       const image = new Image();
//       image.src = src;
//       image.onload = () => {
//         const canvas = document.createElement('canvas');
//         const scaleX = image.naturalWidth / image.width;
//         const scaleY = image.naturalHeight / image.height;
//         canvas.width = crop.width;
//         canvas.height = crop.height;
//         const ctx = canvas.getContext('2d');
  
//         // Habilitar el suavizado de imágenes
//         ctx.imageSmoothingEnabled = true;
//         ctx.imageSmoothingQuality = 'high'; 
  
//         ctx.drawImage(
//           image,
//           crop.x * scaleX,
//           crop.y * scaleY,
//           crop.width * scaleX,
//           crop.height * scaleY,
//           0,
//           0,
//           crop.width,
//           crop.height
//         );
  
//         canvas.toBlob((blob) => {
//           const reader = new FileReader();
//           reader.readAsDataURL(blob);
//           reader.onloadend = () => {
//             setDataSelfie((prev) => [...prev, reader.result]);
//             resolve(reader.result);
//           };
//         }, 'image/jpeg', 1); // Ajuste de la calidad máxima
//         setShow2(!show2);
//         setShow3(!show3);
//       };
//       image.onerror = (error) => {
//         reject(error);
//       };
//     });
//   };
  

//   var ocultarPasoUno = () => {
//     setShow(!show);
//     setShow2(!show2);
//     setShowOverlay(true);
//     if(show3 == true) {
//       return dataSelfie.length > 0 ? dataSelfie = [] : '';
//     }    
//   }

//   var ocultarPasoTres = () => {
//     setShow3(!show3);
//     setShow(!show);
//     setShowOverlay(true);

//     dataSelfie.pop();    
//   }

//   var pasoSiguiente = () => {
//     setShow3(!show3);
//     setShow(!show); 
//     setShowOverlay(true);   
//     setCrop({ x: 70, y: 50, width: 220, height: 250 });

//     if(dataSelfie.length == 3) {
//       setShow(false);
//       setShow2(false);
//       setShow3(false);
//       setShow4(!show4);      
//       pruebaVida(dataSelfie);
//     }
//   }

//   var pruebaVida = async (dataSelfie) => {

//     //**
//     //**
//     //Verificador de Documentos (Prueba de vida).

//     var ineBack = dataSelfie[0].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");
//     console.log("INE: "+ ineBack);
//     var ineFront = dataSelfie[1].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");
//     var selfie = dataSelfie[2].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");

//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       "ineFront": ineBack,
//       "ineBack": ineFront,
//       "selfie": selfie
//     });
    
//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     console.log("FOTOS: " + raw);

//     setCarga("Verificación facial en curso \n Espera un momento...")    
//     //fetch("localhost:5000/app/verificacion", requestOptions)
    
//     fetch("https://server-capture-selfie-d4c65bd43858.herokuapp.com/app/verificacion", requestOptions)
//     .then((response) => response.text())
//     .then((result) => {
//       console.log("RESULT: " + result);
//       if(result != 'El customer fue registrado') {
//         setCarga("No se pudo verificar tu identidad 🙁")
//       } else {
//         setCarga("Verificación de identidad exitosa 🙂")
//       }
//     })
//     .catch((error) => console.error(error));

//   }

//   const estilos = {
//     contenedor: {
//       width: '100%',
//       border: '1px solid black',
//       textAlign: 'center',
//       backgroundColor: '#c0c0c0', 
//       fontFamily: ['Open Sans', 'Helvetica', 'sans-serif'].join(','),
//       padding: '20px',
//       boxSizing: 'border-box',
//       color: '#333',
//     },
//     botonFoto: {
//       color: 'white',
//       border: '1px solid #007BFF',
//       backgroundColor: '#007BFF',
//       margin: '10px',
//       width: '200px',
//       height: '50px',
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: '5px',
//       transition: 'background-color 0.3s ease',
//     },
//     botonFotoHover: {
//       backgroundColor: '#0056b3',
//       border: '1px solid white',
//       margin: '10px 0',
//     },
//     titulo: {
//       fontSize: '1.5em',
//       fontWeight: 'bold',
//       margin: '10px 0',
//       backgroundColor: '#007BFF', 
//       color: 'white', 
//       padding: '10px',
//       borderRadius: '5px',
//       '@media (maxWidth: 768px)': {
//         fontSize: '1.5em',
//       }
//     },
//     subtitulo: {
//       fontSize: '1.5em',
//       margin: '10px 0',
//       backgroundColor: '#007BFF', 
//       color: 'white', 
//       padding: '10px',
//       borderRadius: '5px',
//       '@media (maxWidth: 768px)': {
//         fontSize: '1.2em',
//       },
//       margin: '10px 0',
//       backgroundColor: '#007BFF', 
//       color: 'white', 
//       padding: '10px',
//       borderRadius: '5px',
//     },
//     textoGeneral: {
//       fontSize: '1em',
//       lineHeight: '1.5',
//       margin: '10px 0',
//       backgroundColor: 'rgba(255, 255, 255, 0.😎', 
//       color: '#333', 
//       padding: '10px',
//       borderRadius: '5px',
//       '@media (maxWidth: 768px)': {
//         fontSize: '1em',
//       },
//     },
//     recuadroPunteadoInterno: {
//       border: '2px dashed white', 
//       position: 'absolute',
//       width: '75%',
//       height: '40%',
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       pointerEvents: 'none',
//       maxWidth: '80%',
//       maxHeight: '60%',
//     },
//     imagenOvalada: {
//       position: 'absolute',
//       width: '90%', // Aumentar tamaño
//       height: '100%', // Aumentar tamaño
//       top: '50%',
//       left: '50%',
//       transform: 'translate(-50%, -50%)',
//       pointerEvents: 'none',
//       maxWidth: '100%', // Ajuste máximo
//       maxHeight: '100%', // Ajuste máximo
//     },
//     '@media (min-width: 769px) and (maxWidth: 1024px)': {
//       width: '85vw',
//       height: '95vh',
//     },
//     '@media (min-width: 1025px)': {
//       width: '90vw',
//       height: '100vh',
//   },
//     webcamContenedor: {
//       position: 'relative',
//       width: '100%',
//       height: 'auto',
//       marginBottom: '20px',
//       borderRadius: '10px',
//       overflow: 'hidden',
//     },
//     webcam: {
//       width: '100%',
//       height: 'auto',
//       borderRadius: '10px',
//     },
//     imagenRecortada: {
//       width: '100%',
//       height: 'auto',
//       maxWidth: '100%',
//       maxHeight: '500px',
//       borderRadius: '10px',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//     },
//     cropContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       width: '100%',
//       height: 'auto',
//       margin: '0 auto',
//       borderRadius: '10px',
//       overflow: 'hidden',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//     },
//     buttonContainer: {
//       display: 'flex',
//       flexDirection: 'column', 
//       justifyContent: 'center',
//       alignItems: 'center',
//       gap: '.5px', 
//     },
//   };

//   return (
//     <div className='App' style={estilos.contenedor}>
//       {show && (
//         <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
//           {dataSelfie.length === 0 && (
//             <>
//               <h1 style={estilos.titulo}>Identificacion parte Delantera</h1><br />
//               <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
//             </>
//           )}
//           {dataSelfie.length === 1 && (
//             <>
//               <h1 style={estilos.titulo}>Identificacion parte Trasera</h1><br />
//               <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
//             </>
//           )}
//           {dataSelfie.length === 2 && (
//             <>
//               <h1>Tómate una Selfie</h1><br />
//               <p>Coloca tu rostro dentro del óvalo para realizar la captura.</p>
//             </>
//           )}
  
//           <div style={estilos.webcamContenedor}>
//             <Webcam
//               videoConstraints={dataSelfie.length === 2 ? { facingMode: 'user' } : { facingMode: 'environment' }}
//               audio={false}
//               ref={webcamRef}
//               screenshotFormat='image/jpeg'
//               style={estilos.webcam}
//             />
//             {showOverlay && (
//               <div style={dataSelfie.length === 2 ? estilos.ovaloPunteadoInterno : estilos.recuadroPunteadoInterno}></div>
//             )}

//             {dataSelfie.length === 2 ? (
//               <img src={ovalImage} alt="Oval overlay" style={estilos.imagenOvalada} />
//             ) : (
//               <div style={estilos.recuadroPunteadoInterno}></div>
//             )}
 
//           </div>
//           <span style={{ marginLeft: '0px' }}></span>
//           <center> <Button
//             component='label'
//             role={undefined}
//             variant='outlined'
//             tabIndex={-1}
//             startIcon={<CameraIcon />}
//             style={estilos.botonFoto}
//             onClick={onSelectFile}
//           >
//             Tomar foto
//           </Button></center>
//         </div>
//       )}
  
//       {show2 && (
//         <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
//           <h1 style={{ ...estilos.titulo, ...estilos.colorTexto }}>Recortar foto</h1>
//           <span style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
//             Recorta la foto del documento para obtener un mejor resultado.
//           </span><br /><br />
//           <div style={estilos.cropContainer}>
//             <ReactCrop
//               src={upImg}
//               crop={dataSelfie.length === 2 ? selfieCrop : crop}
//               onImageLoaded={onLoad}
//               onChange={(newCrop) => dataSelfie.length === 2 ? setSelfieCrop(newCrop) : setCrop(newCrop)}
//               onComplete={onCropComplete}
//               style={{ maxWidth: '100%', maxHeight: '100%' }}

//               />
//           </div>
//           <center>
//           <Button
//             component='label'
//             role={undefined}
//             variant='outlined'
//             tabIndex={-1}
//             startIcon={<ContentCutIcon />}
//             style={estilos.botonFoto}
//             onClick={() => makeClientCrop(dataSelfie.length === 2 ? selfieCrop : crop)}
//             >
//             Recortar Foto
//           </Button></center>
//           <span style={{ marginLeft: '0px' }}></span>
//           <center>
//           <Button
//             component='label'
//             role={undefined}
//             variant='outlined'
//             tabIndex={-1}
//             startIcon={<ReplayIcon />}
//             style={estilos.botonFoto}
//             onClick={ocultarPasoUno}
//           >
//             Repetir foto
//           </Button></center>
//         </div>
//     )}
  
//       {show3 && (
//         <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
//           <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
//             <h2 style={estilos.titulo}>Foto capturada</h2>
//             <span style={estilos.textoGeneral}>
//               Verifique la foto recortada
//             </span>
//             <img alt='Crop' style={estilos.imagenRecortada} src={croppedImage} />
//           </div>
//           <div>
//           <center><Button
//               component='label'
//               role={undefined}
//               variant='outlined'
//               tabIndex={-1}
//               startIcon={<ReplayIcon />}
//               style={estilos.botonFoto}
//               onClick={ocultarPasoTres}
//             >
//               Repetir foto
//               <span style={{ marginLeft: '0px' }}></span>
//             </Button></center>
//             <span style={{ marginLeft: '0px' }}></span>
//             <center><Button
//               component='label'
//               role={undefined}
//               variant='outlined'
//               tabIndex={-1}
//               startIcon={<CheckCircleOutlineIcon />}
//               style={estilos.botonFoto}
//               onClick={pasoSiguiente}
//             >
//               Continuar
//             </Button></center>
//           </div>
//         </div>
//       )}
  
//       {show4 && (
//         <div style={{ ...estilos.contenedor, ...estilos.colorTexto }}>
//           <h1 style={estilos.titulo}>{carga}</h1>
//         </div>
//       )}
//     </div>
//   );
   
// };

// export default ImageCropper;




/**
 * ########################################################
 * ########################################################
 * ########################################################
 */

import React, { useState } from 'react';
import '../css/estilos.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrinWide } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/LOGO-CORE.jpg';

const MiComponente = () => {
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carga, setCarga] = useState('');
  const [status, setStatus] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('');

  const handleCheckboxChange = (event) => {
    if(imagenes.length > 0) {
      window.location.reload();
    }
    setSelectedDocument(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      setError('Algunos archivos no son imágenes o superan el tamaño máximo permitido de 5MB.');
      return;
    }

    if (selectedIndex === null) {
      const totalImages = imagenes.length + validFiles.length;
      if (totalImages > 4) {
        setError('No se pueden cargar más de 4 imágenes.');
        return;
      }
    }

    const promises = validFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          // Eliminar el prefijo de la cadena base64
          const base64SinPrefijo = result.replace(/^data:image\/[a-z]+;base64,/, '');
          resolve(base64SinPrefijo);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(results => {
        setError(null);
        if (selectedIndex !== null) {
          setImagenes(prevImagenes => {
            const updatedImages = [...prevImagenes];
            updatedImages[selectedIndex] = results[0];
            return updatedImages;
          });
          setSelectedIndex(null);
        } else {
          if(selectedDocument == 'Pasaporte') {
            setImagenes(prevImagenes => [...prevImagenes, ...results].slice(0, 3));
          } else {
            setImagenes(prevImagenes => [...prevImagenes, ...results].slice(0, 4));
          }          
        }
      })
      .catch(() => {
        setError('Error al cargar las imágenes.');
      });
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    handleButtonClick();
  };

  const getButtonText = () => {
    if(selectedDocument == 'Pasaporte') {      

      if (selectedIndex !== null) return 'Reemplazar Imagen';
      if (imagenes.length === 0) return 'CARGAR PASAPORTE';
      //if (imagenes.length === 1) return 'CARGAR INE REVERSO';
      if (imagenes.length === 1) return 'CARGAR SELFIE';
      if (imagenes.length === 2) return 'CARGAR COMPROBANTE DE DOMICILIO';
      return 'VALIDAR DOCUMENTOS';

    } else {
      if (selectedIndex !== null) return 'Reemplazar Imagen';
      if (imagenes.length === 0) return 'CARGAR INE FRENTE';
      if (imagenes.length === 1) return 'CARGAR INE REVERSO';
      if (imagenes.length === 2) return 'CARGAR SELFIE';
      if (imagenes.length === 3) return 'CARGAR COMPROBANTE DE DOMICILIO';
      return 'VALIDAR DOCUMENTOS';      
    }    
  };

  function validarIdentidad() {   
    
    if( imagenes.length === 4 ){

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "ineFront": imagenes[0],
        "ineBack": imagenes[1],
        "selfie": imagenes[2],
        "comprobante": imagenes[3]
      });

      console.log("JSON: " + raw);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const uuidJson = {
        uuid: ''
      }

      console.log("FOTOS: " + raw);
      setStatus(true);
      setCarga("Estamos validando los documentos \n Espera un momento...")
      //fetch("localhost:5000/app/verificacion", requestOptions)        
      fetch("https://server-capture-selfie-d4c65bd43858.herokuapp.com/app/verificacion", requestOptions)
      .then((response) => response.text())
      .then((result) => {

        if(result == "El customer fue registrado") {
          setCarga("Identidad Verificada.");
          setStatus(false);
        } else {

          console.log("ENTRASTE A DIFERENTE A CUSTOMER FUE REGISTRADO: " + result);
          const rawGetCust = JSON.stringify({
            "uuid": result
          });
          const requestOptionsCus = {
            method: "POST",
            headers: myHeaders,
            body: rawGetCust,
            redirect: "follow"
          };
          fetch("https://server-capture-selfie-d4c65bd43858.herokuapp.com/app/getCustomer", requestOptionsCus)
          .then((response) => response.text())
          .then((result) => {
            console.log("**********ENTRASTE A GET CUSTOMER ***********");
            console.log("RESULT: " + result);            
            setCarga(result);
            setStatus(false);
          })
          .catch((error) => console.error(error));

        } 
        return;
        console.log("RESULTADO: " + JSON.stringify(result));
        if(result != 'El customer fue registrado') {
          console.log("ENTRASTE A DIFERENTE A CUSTOMER FUE REGISTRADO: " + result);
          const rawGetCust = JSON.stringify({
            "uuid": result
          });
          const requestOptionsCus = {
            method: "POST",
            headers: myHeaders,
            body: rawGetCust,
            redirect: "follow"
          };
          fetch("https://server-capture-selfie-d4c65bd43858.herokuapp.com/app/getCustomer", requestOptionsCus)
          .then((response) => response.text())
          .then((result) => {
            console.log("**********ENTRASTE A GET CUSTOMER ***********");
            console.log("RESULT: " + result);            
            setCarga(result);
            setStatus(false);
          })
          .catch((error) => console.error(error));
        }
        //setCarga(result);
        //setStatus(false);
        if(result == 'El customer fue registrado') {
          setCarga("Identidad Verificada.");
          setStatus(false);
        } 
        /*else if(result == 'Prueba de vida fallida Sin coincidencias'){
          setCarga('Prueba de vida fallida, sin coincidencias');
          setStatus(false);
        } else if(result == 'Biometría facial no exitosa'){
          setCarga("Biometria facial no exitosa, sin coincidencias.");
          setStatus(false);
        } else {
          setCarga("No se encontraron coincidencias, vuelve a intentarlo.");
          setStatus(false);
        }*/
      })
      .catch((error) => {
        setCarga("Verificación Facial Fallida");
        setStatus(false);
        console.log("ERR: " + error);
      });
    } else {     
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "ineFront": imagenes[0],
        "ineBack": '',
        "selfie": imagenes[1],
        "comprobante": imagenes[2]
      });

      console.log("JSON: " + raw);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      console.log("FOTOS: " + raw);
      setStatus(true);
      setCarga("Estamos validando los documentos \n Espera un momento...")
      //fetch("localhost:5000/app/verificacion", requestOptions)        
      fetch("https://server-capture-selfie-d4c65bd43858.herokuapp.com/app/verificacion", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log("RESULTADO: " + result);
        if(result == 'El customer fue registrado') {
          setCarga("Identidad Verificada.");
          setStatus(false);
        } else {
          setCarga("No se encontraron coincidencias, vuelve a intentarlo.");
          setStatus(false);
        }
      })
      .catch((error) => {
        setCarga("Verificación Facial Fallida");
        setStatus(false);
        console.log("ERR: " + error);
      });
    }
  }

  /*imagenes.map((imagen, index) => {   
    if(imagenes.length == 3) {
      console.log(imagenes);
    }    
  });*/
  return (    
    <div className="contenedor-imagen">

      <header className="header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
        />
        <h1 className="title">Verificar Documentos</h1>
      </header>

      <div className='divTexto'>
        <span className='nota'><b>Nota</b></span> Si seleccionas un <b> pasaporte</b>, no es necesario cargar el archivo del reverso
      </div>
    
      <div className="document-selector">
        <h3>Selecciona el tipo de documento con el que te quieres identificar</h3>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              value="documento_identidad"
              checked={selectedDocument === 'documento_identidad'}
              onChange={handleCheckboxChange}
            />
            Documento de identidad
          </label>
          <label>
            <input
              type="checkbox"
              value="Pasaporte"
              checked={selectedDocument === 'Pasaporte'}
              onChange={handleCheckboxChange}
            />
            Pasaporte
          </label>
        </div>
        {/* <p className="selected-document">Selected Document: {selectedDocument}</p> */}
      </div>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />
      {error && <p className="error">{error}</p>}
      <div className="imagenes-container">
        {imagenes.map((imagen, index) => (
          <>
          <div key={index} className="image-wrapper" onClick={() => handleImageClick(index)}>
            <img src={`data:image/jpeg;base64,${imagen}`} alt={`Cargado por el usuario ${index + 1}`} className="imagen" />
            <span className="image-overlay">Reemplazar</span>
            {/* <textarea className="base64-textarea" readOnly value={imagen}></textarea> */}
          </div> <br></br></>
        ))}
        {
          <div className='textoDiv'>            
            {carga}
            { status == true ? 
              <img
                src="https://codigofuente.io/wp-content/uploads/2018/09/progress.gif"              
                alt="loading"
                style={{ width: '80px', height: '80px', marginRight: '10px' }}
              /> : ""
            }
          </div>
        }
      </div>
      <br></br><br></br><br></br>
      {selectedDocument == 'Pasaporte' ?
      <button className="custom-file-upload" onClick={imagenes.length == 3 ? validarIdentidad : handleButtonClick}>
        {getButtonText() + " "}
        {imagenes.length <= 1 ? <FontAwesomeIcon icon={faAddressCard} /> : <FontAwesomeIcon icon={faFaceGrinWide} />}        
      </button> :
      
      <button className="custom-file-upload" onClick={imagenes.length == 4 ? validarIdentidad : handleButtonClick}>
        {getButtonText() + " "}
        {imagenes.length <= 1 ? <FontAwesomeIcon icon={faAddressCard} /> : <FontAwesomeIcon icon={faFaceGrinWide} />}        
      </button>
      
      }
      
    </div>
  );
};

export default MiComponente;