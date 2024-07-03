/**
 * @author Saldivar Avilez Angel Armando
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */

/*******************************/
var bundle_version = '17.50';
/*******************************/

var JSONRESP = {
  'status':			'failed',
  'message':		'Bad Request',
  'other_errors':	[],
  'response_code':	400
};

/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *@NModuleScope Public
 */

var jsonGlobal = {
  'custid':		0,
  'userid':		0,
  'ns_company':	''
};

var _params = {};
var SEARCHMODULE, RECORDMODULE, RUNTIMEMODULE, HTTPMODULE, HTTPSMODULE, TASKMODULE, CONFIGMODULE, ERRORMODULE, LOGGING, URLMODULE, MOMENTMODULE, FORMATMODULE, FILEMODULE, CRYPTTOMODULE, TASKMODULE;

define(['N/error', 'N/http', 'N/https', 'N/record', 'N/runtime', 'N/search', 'N/task', 'N/config', 'N/url', 'N/email', 'N/format', 'N/render', 'N/query', 'N/file', 'N/crypto', 'N/task'], runRestlet);
//********************** MAIN FUNCTION **********************
function runRestlet(error, http, https, record, runtime, search, task, config, url, email, format, render, query, file, crypto, task){

    SEARCHMODULE = search;
    RECORDMODULE = record;
    RUNTIMEMODULE = runtime;
    HTTPMODULE = http;
    HTTPSMODULE = https;
    TASKMODULE = task;
    CONFIGMODULE = config;
    ERRORMODULE = error;
    URLMODULE = url;    
    EMAILMODULE = email;
    FORMATMODULE = format;
    FILEMODULE = file;
    CRYPTTOMODULE = crypto;
    TASKMODULE = task;
    
    _params.record = record;
    _params.search = search;
    _params.https = https;
    _params.runtime = runtime;
    _params.config = config;
    _params.url = url;
    _params.email = email;
    _params.format = format;
    _params.query = query;
    _params.render = render;
    _params.file = file; 
    _params.crypto = crypto;
    _params.task = task;

    var returnObj = {};
    returnObj.get = doGet;
    returnObj.post = doPost;
    returnObj.put = doPut;
    returnObj.delete = doDelete;
    return returnObj;
}
/**************************************************************************************************************************************/
function doGet()
{  

    return null;
}
/**************************************************************************************************************************************/
function doPut(restletBody)
{
  //log.debug('Called from PUT', restletBody);
  return JSON.stringify(JSONRESP);
}
/**************************************************************************************************************************************/
function doDelete(restletBody)
{
  //log.debug('Called from DELETE', restletBody);
  return JSON.stringify(JSONRESP);
}
/**************************************************************************************************************************************/

function generateRandomString(length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < length; i++) {
      var index = Math.floor(Math.random() * chars.length);
      randomString += chars[index];
  }
  return randomString;
}

function doPost(bodySelfie)
{

  var uuid = 'ultra.' + generateRandomString(10);
  
  var body = {
    "grant_type": "client_credentials",
    "client_id": "sMseAUxzSE2A5wNe2tyoS1CqXKdOiKPx",
    "client_secret": "2x9WGLe3b_GEn9qMQLHdswMYLPwuO4Vv3E-adi1FfMgsALK1br2JIENLKtI3QDAo",
    "audience": "veridocid"
  }

  //CREACIÓN DE TOKEN
  var responseToken = HTTPSMODULE.post({
      url: 'https://veridocid.azure-api.net/api/auth/token',
      body: body
  });

  var myresponse_body = responseToken.body;
  myresponse_body = JSON.parse(myresponse_body);
  var token = myresponse_body.access_token;

  const raw = JSON.stringify({
    "id": uuid,
    "frontImage": bodySelfie.ineFront,
    "backImage": bodySelfie.ineBack,
    "faceImage": bodySelfie.selfie
  });
  
  var client = HTTPSMODULE.post({
      url: "https://veridocid.azure-api.net/api/id/v3/verify",
      body: raw,
      headers: {
          "Authorization": 'Bearer' + ' ' + token,
          "Content-Type": "application/json"
      },
  });
  var client_body = client.body;
  

  const rawGetCustomer = JSON.stringify({
    "uuid": client_body,
    "includeImages": false
  });

  return crearCustomer(rawGetCustomer, token);
}

//function crearCustomer(rawGetCustomer, token) {    

//  var bandera = setTimeOut(20000000);
  
  //if(bandera) {
    //var customer = consultaCustomer(rawGetCustomer, token);
    //return "CUSTOMER: " + customer;
    //if(!customer.identifier) {
      //return "Entraste";
      // var bandera2 = setTimeOut(20000000);
      // if(bandera2) {
      //   var customer = consultaCustomer(rawGetCustomer, token);    
      //   if(!customer.identifier) {
      //     var bandera3 = setTimeOut(20000000);
      //       if(bandera3) {
      //         return "Llegaste hasta el infinito y más haya";
      //       }
      //   } else {
      //     return "Ya está verificado el customer 2";
      //   }
      // }
    //} else {
      //return "Ya está verificado el customer 1";
    //}
  //}  

//}


// Cambios Eduardo//
function crearCustomer(rawGetCustomer, token) {
  var bandera1 = setTimeOut(20000000);
  if (bandera1) {
    var customer = consultaCustomer(rawGetCustomer, token);
    if (customer) {
      if (customer.status === 'ok') {
        return "Customer verificado y en estado 'ok'";
      } else {
        var bandera2 = setTimeOut(20000000);
        if (bandera2) {
          customer = consultaCustomer(rawGetCustomer, token);
          if (customer.status === 'ok') {
            return "Customer verificado y en estado 'ok' en el segundo intento";
          } else {
            var bandera3 = setTimeOut(20000000);
            if (bandera3) {
              customer = consultaCustomer(rawGetCustomer, token);
              if (customer.status === 'ok') {
                return "Customer verificado y en estado 'ok' en el tercer intento";
              } else {
                return "Customer no está en estado 'ok' después de tres intentos";
              }
            }
          }
        }
      }
    } else {
      return "No se pudo consultar el customer";
    }
  } else {
    return "El tiempo de espera ha expirado";
  }
}




/**
 * @description Consulta de customer
 * @param {*} rawGetCustomer 
 * @param {*} token 
 * @returns customer
 */
function consultaCustomer(rawGetCustomer, token) {
  var getCustomer = HTTPSMODULE.post({
      url: "https://veridocid.azure-api.net/api/id/v3/results",
      body: rawGetCustomer,
      headers: {
          "Authorization": 'Bearer' + ' ' + token,
          "Content-Type": "application/json"
      },
  });

  var customer = getCustomer.body;
  customer = JSON.parse(customer);

  return customer;
}

/**
 * @description Función para simular un setTimeOut
 * @param {*} time 
 * @returns boolean
 */
function setTimeOut(time) {
  var bandera = false;
  for (var index = 0; index <= time; index++) {
    if (index == time) {
      bandera = true;      
    }
  }
  return bandera;
}