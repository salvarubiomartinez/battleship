/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//funcion para simplificar el metodo document.getElementById
function $(id) {
    return document.getElementById(id);
}
;

//el namespace de la apliación
var marcianos = {};

//los marcadores de los dos jugadores
marcianos.marcador1 = 0;
marcianos.marcador2 = 0;

//el constructor de la nave
marcianos.nave = function (nombre) {
    this.nombre = nombre;
    this.right;
    this.left;
    this.up;
    this.down;
    this.bala;
    //guardamos el div de la nave en la variable foo
    this.foo = $(this.nombre);
    this.foo.style.left = Math.floor((Math.random() * window.innerWidth)) + 'px';
    this.foo.style.top = Math.floor((Math.random() * window.innerHeight)) + 'px';
};

//Metodo para mover la nave hacia la derecha
marcianos.nave.prototype.derecha = function () {
    //guardamos el objecto en la variable
    var self = this;
    //asiganos la nueva posicion
    this.foo.style.left = parseInt(this.foo.style.left) + 1 + 'px';
    //corrgimos en caso de salirse de la pantalla
    if (parseInt(this.foo.style.left) > window.innerWidth) {
        this.foo.style.left = '-20px';
    }
    ;
    //llamamos al mismo método después de 40 ms
    this.right = setTimeout(function () {
        self.derecha();
    }, 40);
    //limpiamos el setTimeaout del movimiento contrario
    clearTimeout(this.left);
};

//Metodo para mover la nave hacia la izquierda
marcianos.nave.prototype.izquierda = function () {
    var self = this;
    this.foo.style.left = parseInt(this.foo.style.left) - 1 + 'px';
    if (parseInt(this.foo.style.left) < -20) {
        this.foo.style.left = window.innerWidth + 'px';
    }
    ;
    this.left = setTimeout(function () {
        self.izquierda();
    }, 40);
    clearTimeout(this.right);
};

//Metodo para mover la nave hacia arriba
marcianos.nave.prototype.arriba = function () {
    var self = this;
    this.foo.style.top = parseInt(this.foo.style.top) - 1 + 'px';
    if (parseInt(this.foo.style.top) < -20) {
        this.foo.style.top = window.innerHeight + 'px';
    }
    ;
    this.up = setTimeout(function () {
        self.arriba();
    }, 40);
    clearTimeout(this.down);
};

//Metodo para mover la nave hacia abajo
marcianos.nave.prototype.abajo = function () {
    var self = this;
    this.foo.style.top = parseInt(this.foo.style.top) + 1 + 'px';
    if (parseInt(this.foo.style.top) > window.innerHeight) {
        this.foo.style.top = '-20px';
    }
    ;
    this.down = setTimeout(function () {
        self.abajo();
    }, 40);
    clearTimeout(this.up);
};

//Metodo para que la nave dispare indicando la direccion del disparo
marcianos.nave.prototype.dispara = function (direccion) {
    //generamos la bala con el nombre y la posición actual de la nave
    this.bala = new marcianos.bala(parseInt(this.foo.style.left), parseInt(this.foo.style.top), this.nombre);
    //disparamos la bala
    this.bala.movBala(direccion);
};

//el constructor de la bala
//parametros (posición left, posicion top, nombre de la nave que dispara)
marcianos.bala = function (left, top, nombre) {
    sonidoDisaparo();
    //generamos un div con la bala y lo guardamos en foo
    this.foo = document.createElement("div");
    this.foo.setAttribute("class", "bala");
    $('tablero').appendChild(this.foo);
    //la posicion incial de la bala
    this.foo.style.left = left + 10 + 'px';
    this.foo.style.top = top + 10 + 'px';
    //los milisegundos de vida de la bala
    this.segundos = 0;
    //variable para saber si hemos tocado al enemigo
    this.tocado = false;
    //nombre de la nave que dispara
    this.nombre = nombre;
    //nombre de la nave enemiga
    this.naveEnemiga = nombre == 'nave1' ? $('nave2') : $('nave1');
};

//metodo que lanza la bala
marcianos.bala.prototype.movBala = function (direccion) {
    //guardamos el objecto en la variable
    var self = this;
    //aqui comprobamos si la bala ha tocado al enemigo
    if (
            parseInt(this.foo.style.top) > parseInt(this.naveEnemiga.style.top)
            && parseInt(this.foo.style.top) < parseInt(this.naveEnemiga.style.top) + 20
            && parseInt(this.foo.style.left) > parseInt(this.naveEnemiga.style.left)
            && parseInt(this.foo.style.left) < parseInt(this.naveEnemiga.style.left) + 20
            ) {
        if (this.tocado == false) {
            sonidoTocado();
            this.tocado = true;
            //la nave que ha disparado suma puntos en el marcador y elimina a su enemiga
            if (this.nombre == 'nave1') {
                marcianos.marcador1++;
                $('marcador1').innerHTML = marcianos.marcador1;
                //comprobamos que las naves no se hayan intercambiado los controles
                if (!marcianos.reverse) {
                    marcianos.nave2 = new marcianos.nave('nave2');
                } else {
                    marcianos.nave1 = new marcianos.nave('nave2');
                }

            } else {
                marcianos.marcador2++;
                $('marcador2').innerHTML = marcianos.marcador2;
                if (!marcianos.reverse) {
                    marcianos.nave1 = new marcianos.nave('nave1');
                } else {
                    marcianos.nave2 = new marcianos.nave('nave1');
                }

            }

        }
    }
    //sumamos un milisegundo
    this.segundos++;
    //segun el parametro de dirección moveremos la posición de la bala
    if (direccion === 'derecha' || direccion === 'abajoderecha' || direccion === 'arribaderecha') {
        this.foo.style.left = parseInt(this.foo.style.left) + 1 + 'px';
        //en caso de llegar a un extremo de la pantalla resituamos la bala en el otro lado
        if (this.foo.style.left === window.innerWidth + 'px') {
            this.foo.style.left = '-20px';
        }
    }
    if (direccion === 'izquierda' || direccion === 'abajoizquierda' || direccion === 'arribaizquierda') {
        this.foo.style.left = parseInt(this.foo.style.left) - 1 + 'px';
        if (this.foo.style.left === '-20px') {
            this.foo.style.left = window.innerWidth + 'px';
        }
    }
    if (direccion === 'arriba' || direccion === 'arribaderecha' || direccion === 'arribaizquierda') {
        this.foo.style.top = parseInt(this.foo.style.top) - 1 + 'px';
        if (this.foo.style.top === '-20px') {
            this.foo.style.top = window.innerHeight + 'px';
        }
    }
    if (direccion === 'abajo' || direccion === 'abajoderecha' || direccion === 'abajoizquierda') {
        this.foo.style.top = parseInt(this.foo.style.top) + 1 + 'px';
        if (this.foo.style.top === window.innerHeight + 'px') {
            this.foo.style.top = '-20px';
        }
    }
    //mientras no lleguemos al tiempo limite la bala seguira su curso
    if (this.segundos < 220) {
        setTimeout(function () {
            self.movBala(direccion);
        }, 1);
        //en caso contrario la bala desaparece
    } else {
        this.foo.parentNode.removeChild(this.foo);
    }


};


//sonido de tocado
function sonidoTocado() {
    var snd = new Audio("126415__cabeeno-rossley__enemy-emerge.wav"); // buffers automatically when created
    snd.play();
}

//sonido de disparo
function sonidoDisaparo() {
    var snd = new Audio("126423__cabeeno-rossley__shoot-laser.wav"); // buffers automatically when created
    snd.play();
}

//al cargar todos los elementos html
window.onload = function () {

//Generamos las dos naves
    marcianos.nave1 = new marcianos.nave('nave1');
    marcianos.nave2 = new marcianos.nave('nave2');
    //variable para saber si se han intercambiado las posiciones
    marcianos.reverse = false;
    //asignamos funciones a los tres eventos
    document.onkeypress = controlteclado;
    document.onmousemove = controlmouse;
    document.onmousedown = mousedown;
    //al tocar el ratón las controles de las naves se intercambian, la nave1 pasa a ser la 2, y la 2 la 1
    function mousedown() {
        marcianos.naveTransicion = marcianos.nave1;
        marcianos.nave1 = marcianos.nave2;
        marcianos.nave2 = marcianos.naveTransicion;
        marcianos.reverse = !marcianos.reverse;
    }

    //las teclas que controlan la nave1 y los disparos en todas las direcciones
    function controlteclado(elEvento) {
        var esdeveniment = elEvento || window.event;
        var tecla = esdeveniment.charCode;
        //alert(tecla);
        switch (tecla) {
            case 100:
                marcianos.nave1.derecha();
                break;
            case 97:
                marcianos.nave1.izquierda();
                break;
            case 115:
                marcianos.nave1.abajo();
                break;
            case 119:
                marcianos.nave1.arriba();
                break;
            case 106:
                marcianos.nave1.dispara('derecha');
                break;
            case 103:
                marcianos.nave1.dispara('izquierda');
                break;
            case 121:
                marcianos.nave1.dispara('arriba');
                break;
            case 110:
                marcianos.nave1.dispara('abajo');
                break;
            case 98:
                marcianos.nave1.dispara('abajoizquierda');
                break;
            case 109:
                marcianos.nave1.dispara('abajoderecha');
                break;
            case 116:
                marcianos.nave1.dispara('arribaizquierda');
                break;
            case 117:
                marcianos.nave1.dispara('arribaderecha');
                break;
            case 54:
                marcianos.nave2.dispara('derecha');
                break;
            case 52:
                marcianos.nave2.dispara('izquierda');
                break;
            case 56:
                marcianos.nave2.dispara('arriba');
                break;
            case 50:
                marcianos.nave2.dispara('abajo');
                break;
            case 49:
                marcianos.nave2.dispara('abajoizquierda');
                break;
            case 51:
                marcianos.nave2.dispara('abajoderecha');
                break;
            case 55:
                marcianos.nave2.dispara('arribaizquierda');
                break;
            case 57:
                marcianos.nave2.dispara('arribaderecha');
                break;
            case 104:
                var controls = "Controles del juego\n\
-----------------------------\n\
para mover la nave azul: \n\
\n\
    a " + String.fromCharCode(8592) + "\n\
    d " + String.fromCharCode(8594) + "\n\
    w " + String.fromCharCode(8593) + "\n\
    s " + String.fromCharCode(8595) + "\
\n\
\n\
para disparar con la nave azul\n\
en todas las direcciones según el dibujo:\n\
\n\
       t   y   u    " + String.fromCharCode(8598) + " " + String.fromCharCode(8593) + " " + String.fromCharCode(8599) + "\n\
       g        j    " + String.fromCharCode(8592) + "      " + String.fromCharCode(8594) + "\n\
       b  n   m    " + String.fromCharCode(8601) + " " + String.fromCharCode(8595) + " " + String.fromCharCode(8600) + "\
\n\
\n\
la nave roja se mueve con el ratón. Para disparar:\n\
\n\
       7  8  9     " + String.fromCharCode(8598) + " " + String.fromCharCode(8593) + " " + String.fromCharCode(8599) + "\n\
       4      6    " + String.fromCharCode(8592) + "      " + String.fromCharCode(8594) + "\n\
       1  2  3     " + String.fromCharCode(8601) + " " + String.fromCharCode(8595) + " " + String.fromCharCode(8600) + "\
\n\
\n\
Para intercambiar las naves presiona el ratón";
                alert(controls);
        }

    }
    ;
//variables para guardar la posición antigua del ratón
    var oldX;
    var oldY;
//al mover el ratón...
    function controlmouse(elEvento) {
        var esdeveniment = elEvento || window.event;
        //variables para las posiciones actuales del ratón
        var screenX = esdeveniment.screenX;
        var screenY = esdeveniment.screenY;
        //comparamos la posición antigua del ratón con la nueva
        //y movemos la nave 2 siguiendo el movimiento del ratón
        if (screenX + 2 > oldX) {
            marcianos.nave2.derecha();
        }
        ;
        if (screenX < oldX + 2) {
            marcianos.nave2.izquierda();
        }
        ;
        if (screenY < oldY + 2) {
            marcianos.nave2.arriba();
        }
        ;
        if (screenY + 2 > oldY) {
            marcianos.nave2.abajo();
        }
        ;
        //guardamos las variables actuales que en la proxima ronda serán las antiguas.
        oldY = screenY;
        oldX = screenX;
    }
    ;
};
