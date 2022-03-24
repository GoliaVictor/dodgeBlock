class Intersection {
    constructor () {
        this.objects = [];
        this.intersections = [];
    }

    update(checkAll = true, showPoints = false) {
        if (checkAll) {
            let check;
            this.intersections = [];
            for (const object1 of this.objects) {
                for (const object2 of this.objects) {
                    if (object1.vars.intersects && object2.vars.intersects && object1 != object2) {
                        for (const line1 of object1.lines) {
                            for (const line2 of object2.lines) {
                                check = this.checkLineIntersection(line1, line2, line1[2] || line2[2]);
                                if (check) {
                                    this.intersections.push([object1, object2, check]);
                                }
                            }
                        }
                    }
                }
            }
        }
        for (const object of this.objects) {
            if (object.vars.type == 'rect') {
                push();
                noStroke();
                noFill();
                angleMode(DEGREES);
                
                if (object.vars.fill) {
                    fill(object.vars.fill.r, object.vars.fill.g, object.vars.fill.b);
                }
                if (object.vars.stroke) {
                    stroke(object.vars.stroke.r, object.vars.stroke.g, object.vars.stroke.b);
                }
                
                translate(object.vars.shapeX, object.vars.shapeY);
                rotate(object.vars.rotation);
                rect(0, 0, object.vars.width, object.vars.height);
                pop();
            }
            else if (object.vars.type == 'symmetricalPolygon') {
                push();
                noStroke();
                noFill();
                angleMode(DEGREES);
                
                if (object.vars.fill) {
                    fill(object.vars.fill.r, object.vars.fill.g, object.vars.fill.b);
                }
                if (object.vars.stroke) {
                    stroke(object.vars.stroke.r, object.vars.stroke.g, object.vars.stroke.b);
                }
                
                beginShape();
                for (let n = 0; n < object.vars.vertexes.length-1; n++) {
                    vertex(object.vars.vertexes[n].x, object.vars.vertexes[n].y)
                }
                endShape(CLOSE);
                pop();
            }
            else if (object.vars.type == 'line') {
                push();
                noStroke();

                if (object.vars.stroke) {
                    stroke(object.vars.stroke.r, object.vars.stroke.g, object.vars.stroke.b);
                }
                
                line(object.lines[0][0].x,object.lines[0][0].y,object.lines[0][1].x,object.lines[0][1].y);
                pop();
            }
        }
        if (showPoints) {
            strokeWeight(5)
            for (let pt = 0; pt < this.intersections.length; pt++) {
                stroke(113, 226, 113)
                point(this.intersections[pt][2][0],this.intersections[pt][2][1]);
            }
            strokeWeight(1)
        }
        if (this.intersections.length == 0) {
            return undefined;
        }
        else {
            return this.intersections;
        }
    }

    isIntersecting(tag1,tag2) {
        // Is an object
        let index1;
        let index2;
        if (!Number.isInteger(tag1)) {
            index1 = this.objects.indexOf(tag1);
        }
        else {
            index1 = tag1;
        }
        if (tag2) {
            if (!Number.isInteger(tag2)) {
                index2 = this.objects.indexOf(tag2);
            }
            else {
                index2 = tag2;
            }
        }

        let check;
        this.intersections = [];
        const object1 = this.objects[index1];
        const object2 = this.objects[index2];
        if (object1.vars.intersects && object2.vars.intersects && object1 != object2) {
            for (const line1 of object1.lines) {
                for (const line2 of object2.lines) {
                    check = this.checkLineIntersection(line1, line2, line1[2] || line2[2]);
                    if (check) {
                        this.intersections.push([object1, object2, check]);
                    }
                }
            }
        }

        if (index2) {
            for (let n = 0; n < this.intersections.length; n++) {
                if ((index1 == this.objects.indexOf(this.intersections[n][0]) && index2 == this.objects.indexOf(this.intersections[n][1]))) {
                    return this.intersections[n][2];
                }
                else if ((index1 == this.objects.indexOf(this.intersections[n][1]) && index2 == this.objects.indexOf(this.intersections[n][0]))) {
                    return this.intersections[n][2];
                }
            }
        }
        else {
            for (let n = 0; n < this.intersections.length; n++) {
                if (index1 == this.objects.indexOf(this.intersections[n][0]) || index1 == this.objects.indexOf(this.intersections[n][1])) {
                    return this.intersections[n][2];
                }
            }
        }
    }

    remove(tag) {
        // Is an object
        let index;
        if (!Number.isInteger(tag)) {
            index = this.objects.indexOf(tag);
        }
        else {
            index = tag;
        }
        this.objects.splice(index,1);
    }

    calculateLine(x1,y1,x2,y2,edgeIntersection=true) {
        return [{x:x1,y:y1},{x:x2,y:y2},edgeIntersection];
    }

    createLine(x1,y1,x2,y2,stroke,intersects=true) {
        let edgeIntersection = true;
        let submitStroke;
        if (stroke) {
            submitStroke = {r: stroke[0], g: stroke[1], b: stroke[2]};
        }
        return this.addObject([this.calculateLine(x1,y1,x2,y2,edgeIntersection)],{type:'line',stroke:submitStroke,intersects:intersects});
    }

    // Accepts index,x1,y1,x2,y2,edgeIntersection
    updateLine(tag, updates) {
        let x1 = updates.x1;
        let y1 = updates.y1;
        let x2 = updates.x2;
        let y2 = updates.y2;
        let stroke = updates.stroke;
        let edgeIntersection = updates.edgeIntersection;
        
        // Is an object
        let index;
        if (!Number.isInteger(tag)) {
            index = this.objects.indexOf(tag);
        }
        else {
            index = tag;
        }
        // Is an index of the array
        if (x1) {
            this.objects[tag].lines[0][0].x = x1;
        }
        if (y1) {
            this.objects[tag].lines[0][0].y = y1;
        }
        if (x2) {
            this.objects[tag].lines[0][1].x = x2;
        }
        if (y2) {
            this.objects[tag].lines[0][1].y = y2;
        }
        if (stroke) {
            this.objects[tag].vars.stroke = stroke;
        }
        if (edgeIntersection) {
            this.objects[tag].lines[0][2] = edgeIntersection;
        }
    }

    addObject(lines, vars) {
        let newObject = {lines: lines, vars: vars}
        this.objects.push(newObject);
        return newObject;
    }

    calculateSymmetricalPolygon(shapeX, shapeY, radius, subdivisions, rotation, edgeIntersection) {
        function toRadians (angle) {
            return angle * (Math.PI / 180);
        }
        let vertexes = [];
        for (let a = 0; a < 360; a += 360/subdivisions) {
            vertexes.push({x: radius * Math.cos(toRadians(a+rotation)) + shapeX, y: radius * Math.sin(toRadians(a+rotation)) + shapeY});
        }
        if (vertexes[0] != vertexes[vertexes.length-1]) {
            vertexes.push(vertexes[0]);
        }
        let lines = [];
        for (let n = 0; n < vertexes.length; n++) {
            if (n != 0){
                lines.push(this.calculateLine(vertexes[n-1].x,vertexes[n-1].y,vertexes[n].x,vertexes[n].y, edgeIntersection));
            }
        }
        
        return {vertexes: vertexes, lines: lines};
    }

    createSymmetricalPolygon(shapeX, shapeY, radius, subdivisions, fill, stroke, rotation=0, intersects = true) {
        let edgeIntersection = false;
        let calculated = this.calculateSymmetricalPolygon(shapeX, shapeY, radius, subdivisions, rotation, edgeIntersection);
        let lines = calculated.lines;
        let vertexes = calculated.vertexes;

        let submitFill;
        let submitStroke;
        if (fill) {
            submitFill = {r: fill[0], g: fill[1], b: fill[2]};
        }
        if (stroke) {
            submitStroke = {r: stroke[0], g: stroke[1], b: stroke[2]};
        }
        return this.addObject(lines, {type: 'symmetricalPolygon', shapeX:shapeX, shapeY:shapeY, radius:radius, subdivisions:subdivisions, vertexes: vertexes, fill: submitFill, stroke: submitStroke, rotation:rotation, intersects: intersects, edgeIntersection: edgeIntersection});
    }

    // Accepts shapeX, shapeY, radius, rotation, subdivisions, edgeIntersection
    updateSymmetricalPolygon(tag, changes) {
        // Is an object
        let index;
        if (!Number.isInteger(tag)) {
            index = this.objects.indexOf(tag);
        }
        else {
            index = tag;
        }
        let updates = this.objects[index].vars;

        if (changes.shapeX) {
            updates.shapeX = changes.shapeX;
        }
        if (changes.shapeY) {
            updates.shapeY = changes.shapeY;
        }
        if (changes.radius) {
            updates.radius = changes.radius;
        }
        if (changes.subdivisions) {
            updates.subdivisions = changes.subdivisions;
        }
        if (changes.fill) {
            updates.fill = changes.fill;
        }
        if (changes.stroke) {
            updates.stroke = changes.stroke;
        }
        if (changes.rotation) {
            updates.rotation = changes.rotation;
        }
        if (changes.edgeIntersection) {
            updates.edgeIntersection = changes.edgeIntersection;
        }
        let recalculated = this.calculateSymmetricalPolygon(updates.shapeX, updates.shapeY, updates.radius, updates.subdivisions, updates.rotation, updates.edgeIntersection);
        this.objects[index].lines = recalculated.lines;
        updates.vertexes = recalculated.vertexes;

        this.objects[index].vars = updates;
    }

    calculateRect(shapeX, shapeY, width, height, rotation, edgeIntersection) {
        function toRadians (angle) {
            return angle * (Math.PI / 180);
        }
        let vertexes = [];
        // Top left
        vertexes.push({x: shapeX, y: shapeY});
        // Top right
        vertexes.push({x: shapeX + Math.cos(toRadians(rotation))*width, y: shapeY + Math.sin(toRadians(rotation))*width});
        // Bottom left
        vertexes.push({x: shapeX + Math.cos(toRadians(rotation+90))*height, y: shapeY + Math.sin(toRadians(rotation+90))*height});
        // Bottom right
        vertexes.push({x: vertexes[1].x + (vertexes[2].x - vertexes[0].x), y: vertexes[1].y + (vertexes[2].y - vertexes[0].y)});

        vertexes[0] = vertexes[2];
        vertexes[2] = vertexes[3];
        vertexes[3] = vertexes[0];
        vertexes[0] = {x: shapeX, y: shapeY};

        if (vertexes[0] != vertexes[vertexes.length-1]) {
            vertexes.push(vertexes[0]);
        }

        let lines = [];
        for (let n = 0; n < vertexes.length; n++) {
            if (n != 0){
                lines.push(this.calculateLine(vertexes[n-1].x,vertexes[n-1].y,vertexes[n].x,vertexes[n].y, edgeIntersection));
            }
        }

        return lines;
    }

    createRect(shapeX, shapeY, width, height, fill, stroke, rotation=0, intersects=true) {
        let edgeIntersection = false;
        let lines = this.calculateRect(shapeX, shapeY, width, height, rotation, edgeIntersection);
        let submitFill;
        let submitStroke;
        if (fill) {
            submitFill = {r: fill[0], g: fill[1], b: fill[2]};
        }
        if (stroke) {
            submitStroke = {r: stroke[0], g: stroke[1], b: stroke[2]};
        }
        return this.addObject(lines,{type: 'rect', shapeX:shapeX, shapeY:shapeY, width:width, height:height, fill: submitFill, stroke: submitStroke, rotation:rotation, intersects: intersects, edgeIntersection: edgeIntersection});
    }

    updateRect(tag, changes) {
        // Is an object
        let index;
        if (!Number.isInteger(tag)) {
            index = this.objects.indexOf(tag);
        }
        else {
            index = tag;
        }
        let updates = this.objects[index].vars;

        if (changes.shapeX) {
            updates.shapeX = changes.shapeX;
        }
        if (changes.shapeY) {
            updates.shapeY = changes.shapeY;
        }
        if (changes.width) {
            updates.width = changes.width;
        }
        if (changes.height) {
            updates.height = changes.height;
        }
        if (changes.fill) {
            updates.fill = changes.fill;
        }
        if (changes.stroke) {
            updates.stroke = changes.stroke;
        }
        if (changes.rotation) {
            updates.rotation = changes.rotation;
        }
        if (changes.edgeIntersection) {
            updates.edgeIntersection = changes.edgeIntersection;
        }
        this.objects[index].lines = this.calculateRect(updates.shapeX, updates.shapeY, updates.width, updates.height, updates.rotation, updates.edgeIntersection)
        this.objects[index].vars = updates;
    }

    checkLineIntersection(line1, line2, edgeIntersection) {

        let x1 = Big(line1[0].x);
        let y1 = Big(line1[0].y);
        let x2 = Big(line1[1].x);
        let y2 = Big(line1[1].y);

        let x3 = Big(line2[0].x);
        let y3 = Big(line2[0].y);
        let x4 = Big(line2[1].x); 
        let y4 = Big(line2[1].y);


        let denominator = (((x1.minus(x2)).times(y3.minus(y4))).minus((y1.minus(y2)).times(x3.minus(x4))));
        if (denominator == 0) {
            return;
        }
        let t = (((x1.minus(x3)).times(y3.minus(y4))).minus((y1.minus(y3)).times(x3.minus(x4)))).div(denominator);
        let u = (Big(-1).times(((x1.minus(x2)).times(y1.minus(y3))).minus((y1.minus(y2)).times(x1.minus(x3))))).div(denominator);

        if ((Big(0).cmp(t) == -1 || Big(0).cmp(t) == 0) && (Big(1).cmp(t) == 1 || Big(1).cmp(t) == 0) && (Big(0).cmp(u) == -1 || Big(0).cmp(u) == 0) && (Big(1).cmp(u) == 1 || Big(0).cmp(u) == 0)) {
            let x = (x1.plus(t.times(x2.minus(x1))));
            let y = (y1.plus(t.times(y2.minus(y1))));
            if (edgeIntersection == false) {
                if ((x.eq(x1) && y.eq(y1)) || (x.eq(x2) && y.eq(y2)) || (x.eq(x3) && y.eq(y3)) || (x.eq(x4) && y.eq(y4))) {
                    return;
                }
            }
            return [x,y]
        }
    }
}

function arrayEquals(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (let n = 0; n < arr1.length; n++) {
        if (arr1[n] != arr2[n]) {
            return false;
        }
    }
    return true;
}

let toggle = true;