defineSuite([
        'Core/EllipsoidOutlineGeometry',
        'Core/arrayFill',
        'Core/Cartesian3',
        'Core/Math',
        'Core/GeometryOffsetAttribute',
        'Specs/createPackableSpecs'
    ], function(
        EllipsoidOutlineGeometry,
        arrayFill,
        Cartesian3,
        CesiumMath,
        GeometryOffsetAttribute,
        createPackableSpecs) {
    'use strict';

    it('constructor throws if stackPartitions less than 1', function() {
        expect(function() {
            return new EllipsoidOutlineGeometry({
                stackPartitions: 0
            });
        }).toThrowDeveloperError();
    });

    it('constructor throws if slicePartitions less than 0', function() {
        expect(function() {
            return new EllipsoidOutlineGeometry({
                slicePartitions: -1
            });
        }).toThrowDeveloperError();
    });

    it('constructor throws if subdivisions less than 0', function() {
        expect(function() {
            return new EllipsoidOutlineGeometry({
                subdivisions: -2
            });
        }).toThrowDeveloperError();
    });

    it('constructor rounds floating-point slicePartitions', function() {
        var m = new EllipsoidOutlineGeometry({
            slicePartitions: 3.5,
            stackPartitions: 3,
            subdivisions: 3
        });
        expect(m._slicePartitions).toEqual(4);
    });

    it('constructor rounds floating-point stackPartitions', function() {
        var m = new EllipsoidOutlineGeometry({
            slicePartitions: 3,
            stackPartitions: 3.5,
            subdivisions: 3
        });
        expect(m._stackPartitions).toEqual(4);
    });

    it('constructor rounds floating-point subdivisions', function() {
        var m = new EllipsoidOutlineGeometry({
            slicePartitions: 3,
            stackPartitions: 3,
            subdivisions: 3.5
        });
        expect(m._subdivisions).toEqual(4);
    });

    it('computes positions', function() {
        var m = EllipsoidOutlineGeometry.createGeometry(new EllipsoidOutlineGeometry({
            stackPartitions: 3,
            slicePartitions: 3,
            subdivisions: 3
        }));

        expect(m.attributes.position.values.length).toEqual(24 * 3);
        expect(m.indices.length).toEqual(16 * 2);
        expect(m.boundingSphere.radius).toEqual(1);
    });

    it('computes positions for partial ellipsoid', function() {
        var m = EllipsoidOutlineGeometry.createGeometry(new EllipsoidOutlineGeometry({
            innerRadii: new Cartesian3(0.5, 0.5, 0.5),
            minimumClock: CesiumMath.toRadians(90.0),
            maximumClock: CesiumMath.toRadians(270.0),
            minimumCone: CesiumMath.toRadians(30.0),
            maximumCone: CesiumMath.toRadians(120.0),
            stackPartitions: 3,
            slicePartitions: 3,
            subdivisions: 3
        }));

        expect(m.attributes.position.values.length).toEqual(24 * 3);
        expect(m.indices.length).toEqual(20 * 2);
        expect(m.boundingSphere.radius).toEqual(1);
    });

    it('computes offset attribute', function() {
        var m = EllipsoidOutlineGeometry.createGeometry(new EllipsoidOutlineGeometry({
            stackPartitions : 3,
            slicePartitions: 3,
            subdivisions: 3,
            offsetAttribute: GeometryOffsetAttribute.ALL
        }));

        var numVertices = 24;
        expect(m.attributes.position.values.length).toEqual(numVertices * 3);

        var offset = m.attributes.applyOffset.values;
        expect(offset.length).toEqual(numVertices);
        var expected = new Array(offset.length);
        expected = arrayFill(expected, 1);
        expect(offset).toEqual(expected);
    });

    it('undefined is returned if the x, y, or z radii are equal or less than zero', function() {
        var ellipsoidOutline0 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(0.0, 500000.0, 500000.0)
        });
        var ellipsoidOutline1 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(1000000.0, 0.0, 500000.0)
        });
        var ellipsoidOutline2 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(1000000.0, 500000.0, 0.0)
        });
        var ellipsoidOutline3 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(-10.0, 500000.0, 500000.0)
        });
        var ellipsoidOutline4 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(1000000.0, -10.0, 500000.0)
        });
        var ellipsoidOutline5 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(1000000.0, 500000.0, -10.0)
        });
        var ellipsoidOutline6 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(0.0, 100000.0, 100000.0)
        });
        var ellipsoidOutline7 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(100000.0, 0.0, 100000.0)
        });
        var ellipsoidOutline8 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(100000.0, 100000.0, 0.0)
        });
        var ellipsoidOutline9 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(-10.0, 100000.0, 100000.0)
        });
        var ellipsoidOutline10 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(100000.0, -10.0, 100000.0)
        });
        var ellipsoidOutline11 = new EllipsoidOutlineGeometry({
            radii : new Cartesian3(500000.0, 500000.0, 500000.0),
            innerRadii : new Cartesian3(100000.0, 100000.0, -10.0)
        });

        var geometry0 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline0);
        var geometry1 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline1);
        var geometry2 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline2);
        var geometry3 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline3);
        var geometry4 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline4);
        var geometry5 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline5);
        var geometry6 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline6);
        var geometry7 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline7);
        var geometry8 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline8);
        var geometry9 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline9);
        var geometry10 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline10);
        var geometry11 = EllipsoidOutlineGeometry.createGeometry(ellipsoidOutline11);

        expect(geometry0).toBeUndefined();
        expect(geometry1).toBeUndefined();
        expect(geometry2).toBeUndefined();
        expect(geometry3).toBeUndefined();
        expect(geometry4).toBeUndefined();
        expect(geometry5).toBeUndefined();
        expect(geometry6).toBeUndefined();
        expect(geometry7).toBeUndefined();
        expect(geometry8).toBeUndefined();
        expect(geometry9).toBeUndefined();
        expect(geometry10).toBeUndefined();
        expect(geometry11).toBeUndefined();
    });

    var ellipsoidgeometry = new EllipsoidOutlineGeometry({
        radii : new Cartesian3(1.0, 2.0, 3.0),
        innerRadii : new Cartesian3(0.5, 0.6, 0.7),
        minimumClock : 0.1,
        maximumClock : 0.2,
        minimumCone : 0.3,
        maximumCone : 0.4,
        slicePartitions : 3,
        stackPartitions : 3,
        subdivisions: 3
    });
    var packedInstance = [
        1.0, 2.0, 3.0,
        0.5, 0.6, 0.7,
        0.1, 0.2,
        0.3, 0.4,
        3.0, 3.0, 3.0,
        -1
    ];
    createPackableSpecs(EllipsoidOutlineGeometry, ellipsoidgeometry, packedInstance);
});
