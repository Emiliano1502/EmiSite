// Cookies y DOM clásico para conservar las visitas y las últimas tres firmas.
function leer(nombre) {
  var partes = document.cookie.split('; ');
  for (var i = 0; i < partes.length; i++) {
    if (partes[i].indexOf(nombre + '=') === 0) return decodeURIComponent(partes[i].substring(nombre.length + 1));
  }
  return '';
}
function guardar(nombre, valor) {
  var vence = new Date();
  vence.setFullYear(vence.getFullYear() + 1);
  document.cookie = nombre + '=' + encodeURIComponent(valor) + '; expires=' + vence.toUTCString() + '; path=/';
}
var visitas = parseInt(leer('emiVisitas'), 10) || 0;
if (/inicio\.html$/.test(location.pathname)) guardar('emiVisitas', String(++visitas));
document.getElementById('contador').firstChild.nodeValue = ('000000' + visitas).slice(-6);
var formulario = document.getElementById('firma');
function mostrarFirmas() {
  var lista = document.getElementById('firmas');
  while (lista.firstChild) lista.removeChild(lista.firstChild);
  for (var i = 0; i < 3; i++) {
    var texto = leer('emiFirma' + i);
    if (texto) {
      var fila = document.createElement('p');
      fila.appendChild(document.createTextNode(texto));
      lista.appendChild(fila);
    }
  }
}
if (formulario) {
  mostrarFirmas();
  formulario.onsubmit = function () {
    var alias = formulario.elements.alias.value.replace(/^\s+|\s+$/g, '');
    var mensaje = formulario.elements.mensaje.value.replace(/^\s+|\s+$/g, '');
    if (!alias || !mensaje) return false;
    guardar('emiFirma2', leer('emiFirma1'));
    guardar('emiFirma1', leer('emiFirma0'));
    guardar('emiFirma0', alias + ': ' + mensaje);
    if (leer('emiFirma0') !== alias + ': ' + mensaje) {
      alert('Abre la página desde un servidor local y activa las cookies para guardar la firma.');
      return false;
    }
    formulario.reset();
    mostrarFirmas();
    return false;
  };
}
