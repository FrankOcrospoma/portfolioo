class Vector {
    constructor(...vals) {
        this.vals = vals;
    }
    map(callback) {
        for (var i = 0; i < this.vals.length; i++) {
            callback(this.vals, i);
        }
        return this;
    }
    round() {
        return this.map((arr, i) => arr[i] = round(arr[i], 10));
    }
    add(v) {
        return this.map((arr, i) => arr[i] += v.vals[i]);
    }
    sub(v) {
        return this.map((arr, i) => arr[i] -= v.vals[i]);
    }
    scale(s) {
        return this.map((arr, i) => arr[i] *= s);
    }
    length() {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * arr[i]);
        return Math.pow(sum, 0.5);
    }
  
    normalize() {
        return this.scale(1 / this.length());
    }
    to(v) {
        return v.c().sub(this);
    }
    lerp(v, weight) {
        return this.c().add(this.to(v).scale(weight));
    }
    c() {
        return Vector.fromArray(this.vals.slice());
    }

    dot(v) {
        var sum = 0;
        this.map((arr, i) => sum += arr[i] * v.vals[i]);
        return sum;
    }
    equals(v) {
        for (var i = 0; i < this.vals.length; i++) {
            if (this.vals[i] != v.vals[i]) {
                return false;
            }
        }
        return true;
    }


    get x() {
        return this.vals[0];
    }
    get y() {
        return this.vals[1];
    }
    get z() {
        return this.vals[2];
    }
    set x(val) {
        this.vals[0] = val;
    }
    set y(val) {
        this.vals[1] = val;
    }
    set z(val) {
        this.vals[2] = val;
    }

    static fromArray(vals) {
        var x = new Vector();
        x.vals = vals;
        return x;
    }

}

class RNG {
    constructor(seed) {
        this.seed = seed;
        this.mod = 4294967296;
        this.multiplier = 1664525;
        this.increment = 1013904223;
    }
    next() {
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod;
        return this.seed;
    }
    norm() {
        return this.next() / this.mod;
    }
    range(min, max) {
        return this.norm() * to(min, max) + min;
    }
}

var TAU = Math.PI * 2;
function map(val, from1, from2, to1, to2) {
    return lerp(to1, to2, inverseLerp(val, from1, from2));
}

function createCanvas(x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    canvas.id = 'miCanvas'; // Añadir ID a la etiqueta canvas

    document.body.appendChild(canvas);
    var ctxt = canvas.getContext('2d');
    return { ctxt: ctxt, canvas: canvas };
}

var lastUpdate = Date.now();
function loop(callback) {
    var now = Date.now();
    callback((now - lastUpdate) / 1000);
    lastUpdate = now;
    requestAnimationFrame(() => {
        loop(callback);
    });
}


function findbestIndex(list, evaluator) {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0]);
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i]);
        if (score > bestscore) {
            bestscore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}

function copy2dArray(arr) {
    return create2DArray(get2DArraySize(arr), pos => index2D(arr, pos));
}
function round(number, decimals) {
    var mul = 10 ** decimals;
    return Math.round(number * mul) / mul;
}




var colormap = [
    [new Vector(0, 1, 0), 'white'],
    [new Vector(0, 0, -1), 'green'],
    [new Vector(1, 0, 0), 'red'],
    [new Vector(-1, 0, 0), 'orange'],
    [new Vector(0, -1, 0), 'yellow'],
    [new Vector(0, 0, 1), 'blue'],
];
var color2normalmap = {
    'W': new Vector(0, 1, 0),
    'G': new Vector(0, 0, -1),
    'R': new Vector(1, 0, 0),
    'O': new Vector(-1, 0, 0),
    'Y': new Vector(0, -1, 0),
    'B': new Vector(0, 0, 1),
};
var abbrevcolor2colormap = {
    'W': 'white',
    'G': 'green',
    'R': 'red',
    'O': 'orange',
    'Y': 'yellow',
    'B': 'blue',
};
var actionrotate2frontmap = {
    'F': new Vector(1, 0, 0).scale(1),
    'R': new Vector(0, -1, 0).scale(0.25),
    'U': new Vector(1, 0, 0).scale(0.25),
    'L': new Vector(0, 1, 0).scale(0.25),
    'D': new Vector(-1, 0, 0).scale(0.25),
    'B': new Vector(0, 1, 0).scale(0.5),
    'I': new Vector(0, 0, -1).scale(0.5),
    '0': new Vector(0, 1, 0).scale(1),
};
var rotmap = {
    'F': new Vector(0, 0, -1).scale(0.25),
    'R': new Vector(1, 0, 0).scale(0.25),
    'U': new Vector(0, 1, 0).scale(0.25),
    'L': new Vector(-1, 0, 0).scale(0.25),
    'D': new Vector(0, -1, 0).scale(0.25),
    'B': new Vector(0, 0, 1).scale(0.25),
    'F2': new Vector(0, 0, -1).scale(0.5),
    'R2': new Vector(1, 0, 0).scale(0.5),
    'U2': new Vector(0, 1, 0).scale(0.5),
    'L2': new Vector(-1, 0, 0).scale(0.5),
    'D2': new Vector(0, -1, 0).scale(0.5),
    'B2': new Vector(0, 0, 1).scale(0.5),
    "F'": new Vector(0, 0, -1).scale(0.75),
    "R'": new Vector(1, 0, 0).scale(0.75),
    "U'": new Vector(0, 1, 0).scale(0.75),
    "L'": new Vector(-1, 0, 0).scale(0.75),
    "D'": new Vector(0, -1, 0).scale(0.75),
    "B'": new Vector(0, 0, 1).scale(0.75),
};
class CubeLetFace {
    constructor(obj) {
        var _a;
        this.startnormal = (_a = obj === null || obj === void 0 ? void 0 : obj.normal) === null || _a === void 0 ? void 0 : _a.c();
        Object.assign(this, obj);
    }
    getStartPosition2D(cube) {
        return cube.convert3dto2d(this.parent.startpos, this.startnormal);
    }
    getCurrentPosition2D(cube) {
        return cube.convert3dto2d(this.parent.pos, this.normal);
    }
}
class CubeLet {
    constructor(obj) {
        this.faces = [];
        Object.assign(this, obj);
    }
}   
class Cube {
    constructor() {
        this.cubelets = [];
        this.cubeletFaces = [];
        this.history = [];
        this.RNG = new RNG(0);
        this.directionsposmap = [
            [new Vector(0, 0, -1), new Vector(4, 4), Quaternion.fromAxisAngle(new Vector(0, 1, 0).vals, TAU * 0)],
            [new Vector(0, 0, 1), new Vector(10, 4), Quaternion.fromAxisAngle(new Vector(0, 1, 0).vals, TAU * 0.5)],
            [new Vector(0, 1, 0), new Vector(4, 1), Quaternion.fromAxisAngle(new Vector(1, 0, 0).vals, TAU * -0.25)],
            [new Vector(0, -1, 0), new Vector(4, 7), Quaternion.fromAxisAngle(new Vector(1, 0, 0).vals, TAU * 0.25)],
            [new Vector(1, 0, 0), new Vector(7, 4), Quaternion.fromAxisAngle(new Vector(0, 1, 0).vals, TAU * 0.25)],
            [new Vector(-1, 0, 0), new Vector(1, 4), Quaternion.fromAxisAngle(new Vector(0, 1, 0).vals, TAU * -0.25)],
        ];
        this.reset();
    }
    reset() {
        this.history = [];
        this.RNG.seed = 0;
        this.import(`      
        W,W,W,
        W,W,W,
        W,W,W,
  O,O,O,G,G,G,R,R,R,B,B,B,
  O,O,O,G,G,G,R,R,R,B,B,B,
  O,O,O,G,G,G,R,R,R,B,B,B,
        Y,Y,Y,
        Y,Y,Y,
        Y,Y,Y`);
    }
    copy() {
        return new Cube().import(this.export());
    }
    vector2action(vector) {
        var entries = Object.entries(rotmap);
        var i = findbestIndex(entries, ([key, value]) => {
            return -vector.to(value).length();
        });
        return entries[i][0];
    }
    action2vector(action) {
        return rotmap[action].c();
    }
    changePerspective(compositeActions, perspectives) {
        var res = [];
        for (var perspective of perspectives.split(/\s+/)) {
            for (var compositeAction of compositeActions) {
                var rotatedCompositeAction = '';
                for (var action of compositeAction.split(/\s+/)) {
                    var vector = this.action2vector(action);
                    axisRotate(vector, actionrotate2frontmap[perspective], actionrotate2frontmap[perspective].length());
                    rotatedCompositeAction += `${this.vector2action(vector)} `;
                }
                rotatedCompositeAction = rotatedCompositeAction.trim();
                res.push(rotatedCompositeAction);
            }
        }
        return res;
    }

    apply(rotations, savehistory = true, perspective = 'F') {
        this.reset();
        if (rotations) {
            rotations = this.changePerspective([rotations], perspective)[0];
            if (savehistory) {
                this.history = this.history.concat(rotations.split(/\s+/));
            }
            var rots = this.string2rots(rotations);
            for (var rot of rots) {
                this.rot(rot.c().normalize(), rot.length());
            }
        }
        console.log( rotations)
        return rotations;
    }

    string2rots(input) {
        return input.split(/\s+/).map(op => rotmap[op]);
    }
    rot(faceNormal, turns) {
        var cubelets = this.cubelets.filter(c => c.pos.c().normalize().dot(faceNormal) > 0.1);
        for (var cubelet of cubelets) {
            axisRotate(cubelet.pos, faceNormal, turns);
            for (var cubeletface of cubelet.faces) {
                axisRotate(cubeletface.normal, faceNormal, turns);
            }
        }
    }
    convert3dto2d(pos3d, normal) {
        var [valnormal, offset, quat] = this.directionsposmap.find(vals => vals[0].equals(normal));
        var frontrotated = Vector.fromArray(quat.rotateVector(pos3d.c().vals)).round();
        return new Vector(frontrotated.x + offset.x, frontrotated.y * -1 + offset.y);
    }

    import(data) {
        var colorsgrid = data.trim().split('\n').map(row => row.split(',').filter((cell) => cell != false).map(cell => cell.trim()));
        for (var i of [0, 1, 2, 6, 7, 8]) {
            colorsgrid[i].splice(0, 0, null, null, null);
        }
        this.cubelets = [];
        this.cubeletFaces = [];
        for (var x = -1; x < 2; x++) {
            for (var y = -1; y < 2; y++) {
                for (var z = -1; z < 2; z++) {
                    var normals = [];
                    if (x != 0) {
                        normals.push(new Vector(x, 0, 0));
                    }
                    if (y != 0) {
                        normals.push(new Vector(0, y, 0));
                    }
                    if (z != 0) {
                        normals.push(new Vector(0, 0, z));
                    }
                    var cubelet = new CubeLet({
                        pos: new Vector(x, y, z),
                        startpos: new Vector(0, 0, 0),
                        type: {
                            0: 'core',
                            1: 'center',
                            2: 'edge',
                            3: 'corner',
                        }[normals.length],
                    });
                    this.cubelets.push(cubelet);
                    for (var normal of normals) {
                        var vec2d = this.convert3dto2d(new Vector(x, y, z), normal);
                        var colorabrrev = colorsgrid[vec2d.y][vec2d.x];
                        var startnormal = color2normalmap[colorabrrev];
                        for (var i = 0; i < 3; i++) {
                            if (startnormal.vals[i] != 0) {
                                cubelet.startpos.vals[i] = startnormal.vals[i];
                            }
                        }
                        var newface = new CubeLetFace({
                            color: abbrevcolor2colormap[colorabrrev],
                            parent: cubelet,
                            normal: normal,
                            startnormal: startnormal,
                        });
                        cubelet.faces.push(newface);
                        this.cubeletFaces.push(newface);
                    }
                }
            }
        }
        return this;
    }
   
}

function axisRotate(v, axis, turns) {
    var added = false;
    if (v.vals.length == 2) {
        v.vals.push(0);
        added = true;
    }
    var quat = Quaternion.fromAxisAngle(axis.vals, turns * TAU);
    v.vals = quat.rotateVector(v.vals);
    if (added) {
        v.vals.splice(v.vals.length - 1, 1);
    }
    v.round();
    return v;
}

var gridsize = 50;
var screensize = new Vector(800, 530);
var { canvas, ctxt } = createCanvas(screensize.x, screensize.y);
var cube = new Cube();
var rngseedelement = document.querySelector('#seedvalue');

loop((dt) => {
    ctxt.fillStyle = '#fdd';
    ctxt.fillRect(0, 0, screensize.x, screensize.y);
    drawCube(cube, ctxt);
});
function drawCube(cube, ctxt) {
    const gridSizeWithBorder = gridsize + 1; // Añadir un píxel adicional para el borde
    const faceOffset = 10; // Separación entre caras
    
    for (var face of cube.cubeletFaces) {
        var pos2d = cube.convert3dto2d(face.parent.pos, face.normal);
        var abs = pos2d.c().scale(gridSizeWithBorder); // Escalar para tener en cuenta el tamaño del borde
        
        // Ajustar las coordenadas para la separación entre caras
        abs.x += faceOffset;
        abs.y += faceOffset;

        // Ajustar la posición de la cara individualmente
        if (face.normal.equals(new Vector(0, 0, 1))) { // Cara frontal
            abs.x += 2.1 * gridSizeWithBorder;
            abs.y += 0.6 * gridSizeWithBorder;

        } else if (face.normal.equals(new Vector(0, 0, -1))) { // Cara trasera
             abs.x += 1.5 * gridSizeWithBorder; 
             abs.y += 0.6 * gridSizeWithBorder;

         
        }  else if (face.normal.equals(new Vector(-1, 0, 0))) { // Cara izquierda
            abs.x += 1.2 * gridSizeWithBorder;
            abs.y += 0.6 * gridSizeWithBorder;

        }
        else if (face.normal.equals(new Vector(1, 0, 0))) { // Cara derecha
            abs.x += 1.8 * gridSizeWithBorder;
            abs.y += 0.6 * gridSizeWithBorder;

        }
         
        else if (face.normal.equals(new Vector(0, 1, 0))) { // Cara superior
            abs.y += 0.3 * gridSizeWithBorder;
            abs.x += 1.5 * gridSizeWithBorder;

        }
        else if (face.normal.equals(new Vector(0, -1, 0))) { // Cara inferior
            abs.x += 1.5 * gridSizeWithBorder;
            abs.y += 0.9 * gridSizeWithBorder;
        }
        
        ctxt.fillStyle = face.color;
        ctxt.fillRect(abs.x, abs.y, gridsize, gridsize);
        
        // Dibujar el borde negro
        ctxt.strokeStyle = 'black';
        ctxt.lineWidth = 1;
        ctxt.strokeRect(abs.x, abs.y, gridSizeWithBorder, gridSizeWithBorder);
    }
}




// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var selectedOption;
document.querySelector('select').addEventListener('change', function() {
    selectedOption = this.value;
    // Aquí puedes realizar la acción que desees con la opción seleccionada
    console.log('Opción seleccionada:', selectedOption);
    updateTimesTable(selectedOption);
    updateAVg(selectedOption);

});



document.getElementById("siguiente").addEventListener("click", function() {
    setRandomScramble();

});

function openModel(id, index, det) {
    // Seleccionamos el modal
    var modal = document.querySelector('.dialog.dialogstats');
    var modalTiempo = document.querySelector('.dialog.dialogcfm');

    var grayDiv = document.getElementById('gray');
    if (modal && grayDiv) {
    

        if(index===1){
            if(id===0){
            // Mostramos el modal cambiando su estilo display
                modal.style.display = "block";
                // Mostramos el div gray
                grayDiv.style.display = "block";
                $.get("/tiempodetalle", function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Single: " + data[0].time_interval + "\n\n";
                
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                
                    // Agregar la lista de tiempos
                    detalleText += "Tiempo:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                     
                        detalleText += row.scramble + "\n";
                    });
                
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            }else{
                if(det===0){
                    cerrarModal();
                    // Mostramos el modal cambiando su estilo display
                    modal.style.display = "block";
                    // Mostramos el div gray
                    grayDiv.style.display = "block";
                    $.get("/tiempodetalle/"+ id, function(data) {
                        // Convertir la fecha en el formato YYYY-MM-DD
                        var solveDate = new Date(data[0].solve_date);
                        var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    
                        // Crear la cadena de texto con el encabezado
                        var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                        detalleText += "Single: " + data[0].time_interval + "\n\n";
                    
                        // Encontrar el mayor y el menor tiempo
                        var minTime = Number.MAX_VALUE;
                        var maxTime = Number.MIN_VALUE;
                        data.forEach(function(row, index) {
                            var time = parseFloat(row.time_interval);
                            if (time < minTime) {
                                minTime = time;
                            }
                            if (time > maxTime) {
                                maxTime = time;
                            }
                        });
                    
                        // Agregar la lista de tiempos
                        detalleText += "Tiempo:\n";
                        data.forEach(function(row, index) {
                            detalleText += (index + 1) + ". ";
                         
                            detalleText += row.scramble + "\n";
                        });
                    
                        // Asignar la cadena de texto al textarea
                        document.getElementById("detalle").value = detalleText;
                    });
                }else{


                // Mostramos el modal cambiando su estilo display
                modalTiempo.style.display = "block";
                // Mostramos el div gray
                grayDiv.style.display = "block";

                $.get("/tiempodetalle/"+ id, function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    var mezcla = data[0].scramble;
                    var time_interval = data[0].time_interval;
                    var timeid = data[0].id;

                    console.log(data); // Ver los datos en la consola
                    console.log(time_interval)

                    console.log(mezcla)
                    document.getElementById("mezcla").value = mezcla;
                    document.getElementById("id_tiemposolve").textContent = timeid;

                    document.getElementById("tiemposolve").textContent = time_interval;

                    document.getElementById("fecha").value = formattedDate;

                });
            }
    
            }
        } else if(index===2){
                // Mostramos el modal cambiando su estilo display
        modal.style.display = "block";
        // Mostramos el div gray
        grayDiv.style.display = "block";
            if(id===0){
                $.get("/ao5detalle", function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 5: " + data[0].ao5 + "\n\n";
                
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            }else{
                $.get("/ao5detalle/" + id, function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 5: " + data[0].ao5 + "\n\n";
                
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            }
          
        }else if(index===3){
               // Mostramos el modal cambiando su estilo display
        modal.style.display = "block";
        // Mostramos el div gray
        grayDiv.style.display = "block";
            if(id===0){
                $.get("/ao12detalle", function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 12: " + data[0].ao12 + "\n\n";
                    
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                    
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                    
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                }); 
            }else{
                $.get("/ao12detalle/" + id, function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 12: " + data[0].ao12 + "\n\n";
                    
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                    
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                    
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            }
            
        }else if(index===4){
                // Mostramos el modal cambiando su estilo display
        modal.style.display = "block";
        // Mostramos el div gray
        grayDiv.style.display = "block";
            if(id===0){
                $.get("/ao100detalle", function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 100: " + data[0].ao100 + "\n\n";
                    
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                    
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                    
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            } else{
                $.get("/ao100detalle/"+ id, function(data) {
                    // Convertir la fecha en el formato YYYY-MM-DD
                    var solveDate = new Date(data[0].solve_date);
                    var formattedDate = solveDate.getFullYear() + '-' + ('0' + (solveDate.getMonth() + 1)).slice(-2) + '-' + ('0' + solveDate.getDate()).slice(-2);
                    
                    // Crear la cadena de texto con el encabezado
                    var detalleText = "Generado por csTimer el " + formattedDate + "\n";
                    detalleText += "Avg de 100: " + data[0].ao100 + "\n\n";
                    
                    // Encontrar el mayor y el menor tiempo
                    var minTime = Number.MAX_VALUE;
                    var maxTime = Number.MIN_VALUE;
                    data.forEach(function(row, index) {
                        var time = parseFloat(row.time_interval);
                        if (time < minTime) {
                            minTime = time;
                        }
                        if (time > maxTime) {
                            maxTime = time;
                        }
                    });
                    
                    // Agregar la lista de tiempos
                    detalleText += "Lista de tiempos:\n";
                    data.forEach(function(row, index) {
                        detalleText += (index + 1) + ". ";
                        if (parseFloat(row.time_interval) === minTime || parseFloat(row.time_interval) === maxTime) {
                            detalleText += "(" + row.time_interval + ") ";
                        } else {
                            detalleText += row.time_interval + " ";
                        }
                        detalleText += row.scramble + "\n";
                    });
                    
                    // Asignar la cadena de texto al textarea
                    document.getElementById("detalle").value = detalleText;
                });
            }

            
        }
    
        
    } else {
        console.error("No se pudo encontrar el modal '.dialog.dialogstats' o el div 'gray'.");
    }
}

    
    function cerrarModal() {
        // Seleccionamos el modal
        var modal = document.querySelector('.dialog.dialogstats');
        var modalsolve = document.querySelector('.dialog.dialogcfm');

        var grayDiv = document.getElementById('gray');

        if (modal) {
            // Ocultamos el modal cambiando su estilo display
            modal.style.display = "none";
            modalsolve.style.display = "none";

            grayDiv.style.display = "none";

        } else {
            console.error("No se pudo encontrar el modal '.dialog.dialogstats'.");
        }
    }
    

let timerInterval = 0;
let startTime;
let running = false;
let pressingSpace = false;
let inspeccion = false;

document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
        if (!pressingSpace) {
            pressingSpace = true;
            if (!running) {
                document.getElementById("timer").style.color = "red";
            }
            setTimeout(() => {
                if (pressingSpace && !running) {
                    document.getElementById("timer").style.color = "green";
                    document.getElementById("8").style.color = "green";

                }
            }, 700);
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === " ") {
        if (pressingSpace) {
            pressingSpace = false;
            const timerColor = document.getElementById("timer").style.color;
            if (timerColor === "green") {
                document.getElementById("timer").style.color = "black";
                startTimer();
            } else if (running) {
                var selectElement = document.getElementById("sessionSelect");
                var selectedValue = selectElement.value;
                updateAVg(selectedValue);   
                setRandomScramble();
                stopTimer();
                updateTimer();


            } else if (!inspeccion) {
                startInspection();
            }
        }
    }
});     

document.addEventListener("DOMContentLoaded", function () {
    setRandomScramble();

    restoreSelectedSession();

    
    var selectElement = document.getElementById("sessionSelect");
    var selectedValue = selectElement.value;
    updateTimesTable(selectedValue);
    updateAVg(selectedValue);   
    console.log('sii',selectedValue);
    // Función para almacenar el valor seleccionado en una cookie
    function saveSelectedSession() {
        selectElement = document.getElementById("sessionSelect");
        selectedValue = selectElement.value;
        document.cookie = "selectedSession=" + selectedValue + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        console.log('guardado:'+selectedValue)
    }

    // Función para restaurar el valor seleccionado desde una cookie
    function restoreSelectedSession() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith("selectedSession=")) {
                var selectedValue = cookie.substring("selectedSession=".length);
                document.getElementById("sessionSelect").value = selectedValue;
                break;
            }
        }
    }


    // Ejecutar la función para guardar el valor seleccionado al cambiar la selección
    document.getElementById("sessionSelect").addEventListener("change", function() {
        saveSelectedSession();
    });


     // Leer el valor almacenado en la cookie
     const cookieData = document.cookie.split(';').find(cookie => cookie.trim().startsWith('elapsedTime='));
     if (cookieData) {
         const elapsedTime = parseFloat(cookieData.split('=')[1]);
         
         // Dividir en parte entera y parte decimal
         const integerPart = Math.floor(elapsedTime);
         const decimalPart = (elapsedTime - integerPart).toFixed(2).slice(2);
 
         // Actualizar los elementos <span> correspondientes
         document.querySelector('#timer .integer').textContent = integerPart;
         document.querySelector('#timer .decimal').textContent = '.' + decimalPart;
     }

});

function startInspection() {
    if (!running && !inspeccion) {
        inspeccion = true;
        startCountdown();
        document.getElementById("head").style.display = "none";
        document.getElementById("contenedor_lateral").style.display = "none";
        document.getElementById("aos").style.display = "none";
        document.getElementById("contenedor_cubo").style.display = "none";
        document.getElementById("diferencia").style.display = "none";
        document.getElementById("leftbar").style.display = "none";
        document.getElementById("miCanvas").style.display = "none";

        document.getElementById("timer").style.fontSize = "3250%";
        document.getElementById("timer").style.right = "10%"; 
        document.getElementById("timer").style.color = "red";

    }
}

function startTimer() {
    if (!running) {
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 10);
        running = true;
        inspeccion = false;
        document.getElementById("8").style.color = "red";
        document.getElementById("diferencia").style.display = "none";

        document.getElementById("8").style.display = "none";


    }
}

function stopTimer() {
    if (running) {
        clearInterval(timerInterval);
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        
        // Almacenar elapsedTime en una cookie
        document.cookie = `elapsedTime=${elapsedTime}`;

        const scramble = document.getElementById("scramble").textContent;
        var selectElement = document.getElementById("sessionSelect");
        var selectedValue = selectElement.value;
        saveTime(elapsedTime, scramble, selectedValue);
        updateTimesTable(selectedValue);
        updateAVg(selectedValue);   

        running = false;
        document.getElementById("head").style.display = "block";
        document.getElementById("aos").style.display = "block";
        document.getElementById("contenedor_lateral").style.display = "block";
        document.getElementById("8").style.display = "none";
        document.getElementById("diferencia").style.display = "";
        document.getElementById("timer").style.fontSize = "2250%";
        document.getElementById("leftbar").style.display = "block";
        document.getElementById("miCanvas").style.display = "";
        document.getElementById("timer").style.right = "2%";
        document.getElementById("contenedor_cubo").style.display = "";
    }
}

function updateAVg(sesion_id) {
    $.get("/times/"+sesion_id, function (data) {
        const ultimoRegistro = data[0];
        if(ultimoRegistro){
            const tiempoactual = ultimoRegistro.time_interval !== null ? ultimoRegistro.time_interval : "-";
            const ao5Header = ultimoRegistro.ao5 !== null ? ultimoRegistro.ao5 : "-";
            const ao12Header = ultimoRegistro.ao12 !== null ? ultimoRegistro.ao12 : "-";
            const ao100Header = ultimoRegistro.ao100 !== null ? ultimoRegistro.ao100 : "-";
    
            document.getElementById("ao5-header").textContent = ao5Header;
            document.getElementById("ao12-header").textContent =  ao12Header;
            document.getElementById("ao100-header").textContent =  ao100Header;
            document.getElementById("tiempo_actual").textContent =  tiempoactual;
            document.getElementById("ao5").textContent = ao5Header;
            document.getElementById("ao12").textContent =  ao12Header; 
        }else{
            document.getElementById("ao5-header").textContent = "-";
            document.getElementById("ao12-header").textContent =  "-";
            document.getElementById("ao100-header").textContent =  "-";
            document.getElementById("tiempo_actual").textContent = "-";
            document.getElementById("ao5").textContent = "-";
            document.getElementById("ao12").textContent = "-";

        }
    });

    $.get("/mejortiempo/"+sesion_id, function (data) {
        const ultimoRegistro = data[0];
        const mejor = ultimoRegistro.mejortiempo !== null ? ultimoRegistro.mejortiempo : "-";
        const mejorao5 = ultimoRegistro.ao5 !== null ? ultimoRegistro.mejorao5 : "-";
        const mejorao12 = ultimoRegistro.ao12 !== null ? ultimoRegistro.mejorao12 : "-";
        const mejorao100 = ultimoRegistro.ao100 !== null ? ultimoRegistro.mejorao100 : "-";
        const id_mejor = ultimoRegistro.id_mejortiempo !== null ? ultimoRegistro.id_mejortiempo : "-";
        const id_mejorao5 = ultimoRegistro.id_mejorao5 !== null ? ultimoRegistro.id_mejorao5 : "-";
        const id_mejorao12 = ultimoRegistro.id_mejorao12 !== null ? ultimoRegistro.id_mejorao12 : "-";
        const id_mejorao100 = ultimoRegistro.id_mejorao100 !== null ? ultimoRegistro.id_mejorao100 : "-";
        

        document.getElementById("mejortiempo").textContent =  mejor;
        document.getElementById("mejorao5").textContent = mejorao5;
        document.getElementById("mejorao12").textContent =  mejorao12;
        document.getElementById("mejorao100").textContent =  mejorao100;
        document.getElementById("id_mejortiempo").textContent =  id_mejor;
        document.getElementById("id_mejorao5").textContent = id_mejorao5;
        document.getElementById("id_mejorao12").textContent =  id_mejorao12;
        document.getElementById("id_mejorao100").textContent =  id_mejorao100;



    });
    $.get("/get_time_difference/"+sesion_id, function (data) {
        const diferencia = data;
        const dif = diferencia.difference !== null ? diferencia.difference : "-";
        let dife;
        if(dif>0){
            dife = "(+"+dif+")";
            document.getElementById("diferencia").style.color = "red";

        }else{
            dife = "("+dif+")";
            document.getElementById("diferencia").style.color = "green";

        }
        document.getElementById("diferencia").textContent =  dife;
    });
}

function updateTimesTable(sesion_id) {
    $.get("/times/"+sesion_id, function (data) {
        document.getElementById("times-body").innerHTML = "";
        data.forEach(function (tiempo) {
            agregarTiempo(tiempo);
        });
        agregarIndice();

    });
    // cambiarContenidoCelda()
}

function saveTime(time, scramble, sesion_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/guardar-tiempo/"+sesion_id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
        }
    };
    var data = JSON.stringify({ time: time, scramble: scramble });
    xhr.send(data);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    const seconds = Math.floor(elapsedTime);
    const milliseconds = Math.floor((elapsedTime - seconds) * 100);
    const firstDecimal = Math.floor(milliseconds / 10); // Obtener solo el primer dígito del decimal
    if (running) {
        document.getElementById("timer").innerHTML = seconds + "<span style='font-size: 250px;'>." + firstDecimal + "</span>";
    } else {
        document.getElementById("timer").innerHTML = seconds + "<span style='font-size: 250px;'>." + (milliseconds < 10 ? "0" + milliseconds : milliseconds) + "</span>";
    }
}
 


function startCountdown() {
    let countdown = 15;
    var play = false;
    var play4 = false;

    function updateCountdown() {
        if (!inspeccion) {
            countdown = 15;
            return;
        }
        if (countdown > 0) {
            document.getElementById("timer").textContent = countdown.toFixed();
            countdown -= 0.01;
        }
        if (countdown <= 8 && !play) {
            document.getElementById("8").style.display = "block";
            
            document.getElementById("8").textContent = "8s!";
            // Obtener el elemento de audio
            var audio8 = document.getElementById("audio8");
            
            // Reproducir el audio
            audio8.play();
            play=true;
        }
        if (countdown <= 4  && !play4) {
            document.getElementById("8").textContent = "Go!!!";
             // Obtener el elemento de audio
             var audio4 = document.getElementById("audio4");
            
             // Reproducir el audio
             audio4.play();
             play4=true;
        }
        if (countdown < 1 && document.getElementById("timer").textContent !== "DNF") {
            document.getElementById("timer").textContent = "+2";
            setTimeout(() => {
                if (document.getElementById("timer").textContent === "+2") {
                    document.getElementById("timer").textContent = "DNF";
                }
            }, 2000); // Cambiar a "DNF" después de 2 segundos
        }
    }

    if (!running) {
        clearInterval(timerInterval);
        document.getElementById("timer").style.color = "black";
        timerInterval = setInterval(updateCountdown, 10);
    }
}


var rowCount=0;
function agregarTiempo(tiempo) {
    var row = document.createElement("tr");
    var cellIndex = document.createElement("td");
    var cellTime = document.createElement("td");
    var cellAo5 = document.createElement("td");
    var cellAo12 = document.createElement("td");
    var hiddenId = document.createElement("input"); // Input oculto para almacenar el ID
    hiddenId.type = "hidden";
    hiddenId.value = tiempo.id; // Aquí almacenamos el ID en el input oculto


    cellTime.textContent = tiempo.time_interval !== null ? tiempo.time_interval : "-";
    cellAo5.textContent = tiempo.ao5 !== null ? tiempo.ao5 : "-";
    cellAo12.textContent = tiempo.ao12 !== null ? tiempo.ao12 : "-";
    
    // Agregar evento de clic a cada celda
    [cellIndex, cellTime, cellAo5, cellAo12].forEach(function(cell, index) {
        cell.addEventListener('click', function() {
            var id = hiddenId.value; // Obtener el ID almacenado en el input oculto
            console.log('Celda clickeada, ID:', id, 'Columna:', index);
            openModel(id, index);
        });
    });

    row.appendChild(hiddenId); // Agregar input oculto a la fila
    row.appendChild(cellIndex);
    row.appendChild(cellTime);
    row.appendChild(cellAo5);
    row.appendChild(cellAo12);
    var table = document.getElementById("times-body");
    table.appendChild(row);

}

function cambiarContenidoCelda() {
    // Obtener el ID de la última celda cellIndex
    var lastCellIndexId = 'cellIndex_' + rowCount;
    
    // Cambiar el contenido de la celda cellIndex
    var cellIndex = document.getElementById(lastCellIndexId);
    if (cellIndex) {
        cellIndex.textContent = "Nuevo Contenido";
    } else {
        console.log("No se encontró la celda con ID:", lastCellIndexId);
    }
}


function agregarIndice() {
    var table = document.getElementById("times-body");
    var rowCount = table.rows.length;

    for (var i = 0; i < rowCount; i++) {
        var row = table.rows[i];
        var cellIndex = row.cells[0]; // La primera celda de cada fila es la columna de índice
        cellIndex.textContent = rowCount - i; // Asigna el índice consecutivo descendente según la cantidad de filas
    }
}



const moves = ["U", "D", "L", "R", "F", "B"];
const modifiers = ["", "'", "2"];

const forbiddenMoves = {
    "U": ["D", "U'"],
    "D": ["U", "D'"],
    "L": ["R", "L'"],
    "R": ["L", "R'"],
    "F": ["B", "F'"],
    "B": ["F", "B'"]
};

function setRandomScramble() {
    const minLength = 18;
    const maxLength = 21;

    const scrambleLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    let scramble = [];
    let previousMove = "";

    for (let i = 0; i < scrambleLength; i++) {
        let move = getRandomElement(moves);
        while (move === previousMove || isForbiddenMove(previousMove, move)) {
            move = getRandomElement(moves);
        }

        let modifier = getRandomElement(modifiers);
        scramble.push(move + modifier);
        previousMove = move;
    }

    const scrambleString = scramble.join("&nbsp;");
    const scrambleElement = document.getElementById('scramble');
    scrambleElement.innerHTML = scrambleString;
    console.log( scrambleElement.value );
    cube.apply(scrambleElement.value, true, perspectiveSelect.value);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isForbiddenMove(previousMove, currentMove) {
    return previousMove && forbiddenMoves[previousMove].includes(currentMove);
}
var cubo_color=false;
var tabla_color=false;

function toggleColor(element) {
    var head = document.getElementById('head');
    var contenedor_cubo = document.getElementById('miCanvas');
    var contenedor_lateral = document.getElementById('contenedor_lateral');

    console.log(element.classList[1]);
    if (element.classList.contains("active")) {
        element.classList.remove("active");
        if (element.classList[1]==="c3"){
            head.style.display = "none";    
        }else if(element.classList[1]==="c6"){
            contenedor_cubo.style.display = "none";    
        }else{
            contenedor_lateral.style.display = "none";    
        }
    } else {
        element.classList.toggle("active");
        if (element.classList[1]==="c3"){
            head.style.display = "block";    
        }else if(element.classList[1]==="c6"){
            contenedor_cubo.style.display = "block";    
        } else{
            contenedor_lateral.style.display = "block";    
        }       
    }
    
}


