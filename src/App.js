import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import Webcam from 'react-webcam';

import 'react-image-crop/dist/ReactCrop.css';


import 'react-image-crop/dist/ReactCrop.css';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CameraIcon from '@mui/icons-material/Camera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';//Siguiente
import ContentCutIcon from '@mui/icons-material/ContentCut'; //Tijeras
import ReplayIcon from '@mui/icons-material/Replay'; //Volver
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';//Check Continuar

  //import ovalImage from './img/contorno.png'; // <- Asegúrate de que esta ruta es correcta
  import ovalImage from './img/contorno1.png';

const ImageCropper = () => {

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);  
  const webcamRef = useRef(null);    
  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [dataSelfie, setDataSelfie] = useState([]);
  const [crop, setCrop] = useState({ unit: '%', x: 20, y: 30, width: 60, height: 40, aspect: 3 / 2 });
  const [croppedImage, setCroppedImage] = useState('null');
  const [showOverlay, setShowOverlay] = useState(true);
  const [src, setSrc] = useState(null);
  const [cropWidth, setCropWidth] = useState('');
  const [cropHeight, setCropHeight] = useState('');
  const [cropX, setCropX] = useState('');
  const [cropY, setCropY] = useState('');
  const [token, setToken] = useState(null);
  const [carga, setCarga] = useState('');

  //VARIABLES DE ENTORNO
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;


  const onSelectFile = useCallback((e) => {
    if (webcamRef.current.getScreenshot()) {
      setCrop({ unit: '%', x: 20, y: 30, width: 60, height: 40, aspect: 3 / 2 }); 
      const reader = new FileReader();      
      setSrc(webcamRef.current.getScreenshot());
      setUpImg(webcamRef.current.getScreenshot());

      const fileDetail = [
        '',
        new Uint8Array([10]),
        new Uint32Array([2]),
      ];
      const file = new File(
      [fileDetail], 'file.png',
      {lastModified: new Date(2022, 0, 5), type: ''});
      reader.readAsDataURL(file);
      setShow(!show);
      setShow2(!show2);
      setShowOverlay(false);
    }
  }, [webcamRef]);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);  

  const onCropComplete = (crop) => {    
    setCropX(crop.x);
    setCropY(crop.y);
    setCropWidth(crop.width);
    setCropHeight(crop.height);    
  };

  var makeClientCrop = async (crop) => {
    if (src && cropWidth && cropHeight) {
      crop.width = cropWidth;
      crop.height = cropHeight;  
      crop.x = cropX;
      crop.y = cropY;    
      const croppedImageUrl = await getCroppedImg(src, crop);
      setCroppedImage(croppedImageUrl);
    }
  }; 

  const getCroppedImg = (src, crop) => {
    
    return new Promise((resolve, reject) => {      
      const image = new Image();
      image.src = src;      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;      
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {   
            //console.log("SRC: " + reader.result);  
            setDataSelfie(dataSelfie.concat(reader.result));
            resolve(reader.result);
          };
        }, 'image/jpeg');
        setShow2(!show2);
        setShow3(!show3)
      };      
      image.onerror = (error) => {
        reject(error);
      };
    });
  };

  var ocultarPasoUno = () => {
    setShow(!show);
    setShow2(!show2);
    setShowOverlay(true);
    if(show3 == true) {
      return dataSelfie.length > 0 ? dataSelfie = [] : '';
    }    
  }

  var ocultarPasoTres = () => {
    setShow3(!show3);
    setShow(!show);
    setShowOverlay(true);

    dataSelfie.pop();    
  }

  var pasoSiguiente = () => {
    setShow3(!show3);
    setShow(!show); 
    setShowOverlay(true);   
    setCrop({ x: 70, y: 50, width: 220, height: 250 });

    if(dataSelfie.length == 3) {
      setShow(false);
      setShow2(false);
      setShow3(false);
      setShow4(!show4);      
      pruebaVida(dataSelfie);
    }
  }


  function prueba() {
    return "Hola";
  }
  
  // Función para generar un identificador único
  function generarIdentificadorUnico() {
    return uuidv4();
  }

  var pruebaVida = async (dataSelfie) => {

    const token = await fetch("https://server-capture-selfie-b01dd8c9a312.herokuapp.com/getToken")
                        .then((response) => response.text());

    console.log("TOKEN ACCESO PRUEBA VIDA: " + token);

    //********************************
    //********************************
    //Verificador de Documentos (Prueba de vida).

    var ineBack = dataSelfie[0].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");
    var ineFront = dataSelfie[1].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");
    var selfie = dataSelfie[2].replace(new RegExp("data:image/jpeg;base64,", "gi"), "");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer" + " " + token);

    const raw = JSON.stringify({
      "id": generarIdentificadorUnico(),
      "frontImage": ineBack,
      "backImage": ineFront,
      "faceImage": selfie
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch("https://veridocid.azure-api.net/api/id/v3/verify", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log("TOKEN 2: " + token);
      console.log("=====ENTRASTE A VERIFICACION DOCUMENTO======");
      console.log("RESULT: " + result);
      setCarga('Espere mientras se verifica tu información...');

      setTimeout(() => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer" + " " + token);

        const raw = JSON.stringify({
          "uuid": result,
          "includeImages": false
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };        

        fetch("https://veridocid.azure-api.net/api/id/v3/results", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            if(!result.identifier) {              
              setTimeout(() => {
                fetch("https://veridocid.azure-api.net/api/id/v3/results", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  if(!result.identifier) {
                    setTimeout(() => {
                      fetch("https://veridocid.azure-api.net/api/id/v3/results", requestOptions)
                      .then((response) => response.text())
                      .then((result) => {
                        setCarga('Datos enviados con exito!');
                        crearCustomer(result);
                      })
                    }, 20000);
                  } else {
                    setCarga('Datos enviados con exito!');
                    crearCustomer(result);
                  }
                })
              }, 20000);
            } else {
              setCarga('Datos enviados con exito!');
              crearCustomer(result);
            }
          })
          .catch((error) => console.error(error));
      }, 20000);
                  
    })    
    .catch((error) => console.error(error));
   
  }

  function crearCustomer(customer) {
   
    const myHeaders = new Headers();
    myHeaders.append("Content-type", "application/json");
    myHeaders.append("Authorization", "OAuth realm=\"9323217\",oauth_consumer_key=\"6909223765d68229f521ae5355031e937bc39ff684ce9a38ca644f8c9929bf1a\",oauth_token=\"5e39a16ee321f9fab4d635bc694decb02b470de42e13c362d5f0f9b8a6b8b471\",oauth_signature_method=\"HMAC-SHA256\",oauth_timestamp=\"1713912081\",oauth_nonce=\"6Tu5El2vtpR\",oauth_version=\"1.0\",oauth_signature=\"WRW4XjcugcHH2ZvVCG4fvedjR38cGU48o52pw0aTC2E%3D\"");
    myHeaders.append("Cookie", "_abck=6D4A99472AEB74D57807B05C3A17AEDB~-1~YAAQT8X3vQ9lDPOOAQAASPMV+AsVpjjapbj7mcumlFM2pZPpqIkbiUbGehCqxvzPkEJWsq8yYJw9JplexuTsWQ//ihXsGyr+rDVytKoTJaqIKgVjMIHBZRG505cwIIYYG1+vE9MXYv145n/K/Jv3b71L1xG3fUJTHe6+hJuFWbKcorIQMg47R1Kd0N3SVHuzN83qR33eyVWma8XS5D5MoYGO7oKVlkE2cRoAmDkyAbgX6nBywfgLbOaEC6g8/AFU8RLiA/dPrqqpxfIzUwKji9WeSBqEAnPH6kI9hg7NpBl+DFbtdiLqLq0KmfJnwxIiPC/8iYcWBXWP/VPtzQTCfFaDn8v4Vqy+/kbjvt/l+dZtb1HT9NlI2lVAUL24jWLQSZgeP5HciwFh~-1~-1~-1");

    const raw = JSON.stringify({
      "nombre": "123"
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
      mode: 'cors'
    };

    fetch("https://9323217.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=383&deploy=1&123", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

  }
  
  const estilos = {
    contenedor: {
      width: '100%',
      border: '1px solid black',
      textAlign: 'center',
<<<<<<< HEAD
      backgroundColor: '#3f3c38',
      fontFamily: ['Open Sans', 'Helvetica', 'sans-serif'].join(','),
      padding: '20px',
      boxSizing: 'border-box',
    },
    botonFoto: {
      color: 'white',
      border: '1px solid white',
      margin: '10px 0',
    },
    titulo: {
      fontSize: '2em',
      '@media (max-width: 768px)': {
        fontSize: '1.5em',
      },
    },
    subtitulo: {
      fontSize: '1.8em',
      '@media (max-width: 768px)': {
        fontSize: '1.2em',
      },
    },
    textoGeneral: {
      fontSize: '1.5em',
      '@media (max-width: 768px)': {
        fontSize: '1em',
      },
    },
    colorTexto: {
      color: 'white',
    },
    recuadroPunteadoInterno: {
      border: '2px dashed white',
=======
      backgroundColor: '#c0c0c0', 
      fontFamily: ['Open Sans', 'Helvetica', 'sans-serif'].join(','),
      padding: '20px',
      boxSizing: 'border-box',
      color: '#333',
    },
    botonFoto: {
      color: 'white',
      border: '1px solid #007BFF',
      backgroundColor: '#007BFF',
      margin: '10px',
      width: '200px',
      height: '50px',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease',
    },
    botonFotoHover: {
      backgroundColor: '#0056b3',
    },
    titulo: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      margin: '10px 0',
      backgroundColor: '#007BFF', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
    },
    subtitulo: {
      fontSize: '1.5em',
      margin: '10px 0',
      backgroundColor: '#007BFF', 
      color: 'white', 
      padding: '10px',
      borderRadius: '5px',
    },
    textoGeneral: {
      fontSize: '1em',
      lineHeight: '1.5',
      margin: '10px 0',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      color: '#333', 
      padding: '10px',
      borderRadius: '5px',
    },
    recuadroPunteadoInterno: {
      border: '2px dashed white', 
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
      position: 'absolute',
      width: '60%',
      height: '40%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      maxWidth: '80%',
      maxHeight: '60%',
    },
<<<<<<< HEAD
    imagenOvalada: {
      position: 'absolute',
      width: '90%', // Aumentar tamaño
      height: '100%', // Aumentar tamaño
=======
    ovaloPunteadoInterno: {
      border: '2px dashed #007BFF', 
      borderRadius: '50%',
      position: 'absolute',
      width: '40%',
      height: '60%',
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
<<<<<<< HEAD
      maxWidth: '1000%', // Ajuste máximo
      maxHeight: '100%', // Ajuste máximo
=======
      maxWidth: '60%',
      maxHeight: '70%',
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
    },
    webcamContenedor: {
      position: 'relative',
      width: '100%',
      height: 'auto',
      marginBottom: '20px',
<<<<<<< HEAD
=======
      borderRadius: '10px',
      overflow: 'hidden',
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
    },
    webcam: {
      width: '100%',
      height: 'auto',
<<<<<<< HEAD
=======
      borderRadius: '10px',
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
    },
    imagenRecortada: {
      width: '100%',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '500px',
<<<<<<< HEAD
    },
    p:{
      fontSize:"20px",
    },
  };

return (
  <div className='App' style={estilos.contenedor}>
    { show &&
      <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto, ...estilos.p }}>
        {dataSelfie.length === 0 && <>
          <h1 style={estilos.titulo}>Camara Trasera</h1>
          <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
        </>}
        {dataSelfie.length === 1 && <>
          <h1>Camara Delantera</h1>
          <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
        </>}
        {dataSelfie.length === 2 && <>
          <h1>Tómate una Selfie</h1>
          <p>Coloca tu rostro dentro del óvalo para realizar la captura.</p>
        </>}

        <div style={estilos.webcamContenedor}>
          <Webcam
            videoConstraints={dataSelfie.length === 2 ? { facingMode: "user" } : { facingMode: "environment" }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={estilos.webcam}
          />
 {dataSelfie.length === 2 ? (
              <img src={ovalImage} alt="Oval overlay" style={estilos.imagenOvalada} />
            ) : (
              <div style={estilos.recuadroPunteadoInterno}></div>
            )}
          
  

        </div>
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<CameraIcon />}
          style={estilos.botonFoto}
          onClick={onSelectFile}
        >
          Tomar foto
        </Button>
      </div>
    }

    { show2 &&
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h1 style={{...estilos.titulo, ...estilos.colorTexto }}>Recortar foto</h1>
        <span style={{...estilos.textoGeneral, ...estilos.colorTexto, ...estilos.p}}>
        <p>Recorta la foto del documento para obtener un mejor resultado.</p>
        </span>
      
        <div style={{ width: '100%', height: 'auto', position: 'relative' }}>
          <ReactCrop
            src={upImg}
            crop={dataSelfie.length === 2 ? {
              unit: '%',
              x: 30,
              y: 20,
              width: 40,
              height: 60
            } : {
              unit: '%',
              x: 20,
              y: 30,
              width: 60,
              height: 40
            }}
            onImageLoaded={onLoad}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => onCropComplete(c)}
            style={{ width: '100%', height: 'auto' }}
          />
            {dataSelfie.length === 2 ? (
              <img src={ovalImage} alt="Oval overlay" style={estilos.imagenOvalada} />
            ) : (
              <div style={estilos.recuadroPunteadoInterno}></div>
            )}
       
        </div>
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<ContentCutIcon />}
          style={estilos.botonFoto}
          onClick={makeClientCrop}
        >
          Recortar Foto
        </Button>
        <span style={{ marginLeft: '20px' }}></span>
        <Button
          component="label"
          role={undefined}
          variant="outlined"
          tabIndex={-1}
          startIcon={<ReplayIcon />}
          style={estilos.botonFoto}
          onClick={ocultarPasoUno}
        >
          Repetir foto
        </Button>
      </div>
    }
          { show3 &&
        <div style={{ ...estilos.contenedor, ...estilos.colorTexto }}>
          <div style={{ width: '100%', height: '15%' }}>
            <h2 style={estilos.titulo}>Foto capturada</h2>
            <span style={{...estilos.textoGeneral, ...estilos.p }}>
            <p>Verifique la foto recortada </p>
            </span>
            <img alt="Crop" style={estilos.imagenRecortada} src={croppedImage} />
          </div>
          <div>
            <Button
              component="label"
              role={undefined}
              variant="outlined"
=======
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    cropContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 'auto',
      margin: '0 auto',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div className='App' style={estilos.contenedor}>
      {show && (
        <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
          {dataSelfie.length === 0 && (
            <>
              <h1 style={estilos.titulo}>Camara Trasera</h1><br />
              <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
            </>
          )}
          {dataSelfie.length === 1 && (
            <>
              <h1 style={estilos.titulo}>Camara Delantera</h1><br />
              <p>Coloca tu documento de identidad dentro del recuadro para realizar la captura.</p>
            </>
          )}
          {dataSelfie.length === 2 && (
            <>
              <h1>Tómate una Selfie</h1><br />
              <p>Coloca tu rostro dentro del óvalo para realizar la captura.</p>
            </>
          )}
  
          <div style={estilos.webcamContenedor}>
            <Webcam
              videoConstraints={dataSelfie.length === 2 ? { facingMode: 'user' } : { facingMode: 'environment' }}
              audio={false}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              style={estilos.webcam}
            />
            {showOverlay && (
              <div style={dataSelfie.length === 2 ? estilos.ovaloPunteadoInterno : estilos.recuadroPunteadoInterno}></div>
            )}
          </div><br /><br />
          <Button
            component='label'
            role={undefined}
            variant='outlined'
            tabIndex={-1}
            startIcon={<CameraIcon />}
            style={estilos.botonFoto}
            onClick={onSelectFile}
          >
            Tomar foto
          </Button><br /><br /><br /><br />
        </div>
      )}
  
      {show2 && (
        <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
          <h1 style={{ ...estilos.titulo, ...estilos.colorTexto }}>Recortar foto</h1>
          <span style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
            Recorta la foto del documento para obtener un mejor resultado.
          </span><br /><br />
          <div style={estilos.cropContainer}>
            <ReactCrop
              src={upImg}
              crop={crop}
              onImageLoaded={onLoad}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={onCropComplete}
                  style={{ maxWidth: '100%', maxHeight: '100%' }}

              />
          </div>
          <Button
            component='label'
            role={undefined}
            variant='outlined'
            tabIndex={-1}
            startIcon={<ContentCutIcon />}
            style={estilos.botonFoto}
            onClick={() => makeClientCrop(crop)}
          >
            Recortar Foto
          </Button>
          <span style={{ marginLeft: '20px' }}></span>
          <Button
            component='label'
            role={undefined}
            variant='outlined'
            tabIndex={-1}
            startIcon={<ReplayIcon />}
            style={estilos.botonFoto}
            onClick={ocultarPasoUno}
          >
            Repetir foto
          </Button><br /><br /><br /><br />
        </div>
      )}
  
      {show3 && (
        <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
          <div style={{ ...estilos.textoGeneral, ...estilos.colorTexto }}>
            <h2 style={estilos.titulo}>Foto capturada</h2>
            <span style={estilos.textoGeneral}>
              Verifique la foto recortada
              <br /><br />
            </span>
            <img alt='Crop' style={estilos.imagenRecortada} src={croppedImage} />
          </div><br /><br />
          <div>
            <Button
              component='label'
              role={undefined}
              variant='outlined'
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
              tabIndex={-1}
              startIcon={<ReplayIcon />}
              style={estilos.botonFoto}
              onClick={ocultarPasoTres}
            >
              Repetir foto
            </Button>
            <span style={{ marginLeft: '20px' }}></span>
            <Button
<<<<<<< HEAD
              component="label"
              role={undefined}
              variant="outlined"
=======
              component='label'
              role={undefined}
              variant='outlined'
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
              tabIndex={-1}
              startIcon={<CheckCircleOutlineIcon />}
              style={estilos.botonFoto}
              onClick={pasoSiguiente}
            >
              Continuar
<<<<<<< HEAD
            </Button><br />
          </div>
        </div>
      }

      { show4 && <>
        <div style={{ ...estilos.contenedor, ...estilos.colorTexto }}>
          <h1 style={estilos.titulo}>{carga}</h1>
        </div>
      </>}
    </div>
  );
}

=======
            </Button><br /><br /><br /><br />
          </div>
        </div>
      )}
  
      {show4 && (
        <div style={{ ...estilos.contenedor, ...estilos.colorTexto }}>
          <h1 style={estilos.titulo}>{carga}</h1>
        </div>
      )}
    </div>
  );
   
};
>>>>>>> f9fa705ca50fc29b23c5479128159679739f5ffe
export default ImageCropper;