/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Example showing the usage of Well Known Text collection in real life.
        var defaultLayer = new WorldWind.RenderableLayer("WKT Geometry Collection");
        new WorldWind.Wkt("" +
            "GEOMETRYCOLLECTION(" +
            "   POLYGON ((40 -70, 45 -80, 40 -90)), " +
            "   POINT (33 -75)," +
            "   MULTIPOINT ((38 -70),(42 -75),(38 -80))," +
            "   LINESTRING ((33 -75, 37 -80, 33 -85))," +
            "   MULTILINESTRING ((38 -70, 42 -75, 38 -80),(43 -65, 47 -70, 43 -75))" +
            ")").load(null, null, defaultLayer);
        wwd.addLayer(defaultLayer);

        // Using the callback mechanism presented in the Wkt parser to update the shapes as well as showing the information about the successful rendering.
        var customCallbackLayer = new WorldWind.RenderableLayer("WKT Multi Polygon");
        new WorldWind.Wkt("MULTIPOLYGON (((50 -60, 55 -70, 50 -80)),((30 -60, 35 -70, 30 -80)))").load(
            function completionCallback(wkt, objects){
                // Once all the shapes are parsed, this function is called.
                console.log('Parsing of the Wkt was completed');

                wkt.defaultParserCompletionCallback(wkt, objects);
            },
            function shapeConfigurationCallback(shape){
                if (shape.type == WorldWind.WktType.SupportedGeometries.MULTI_POLYGON) {
                    var shapeAttributes = new WorldWind.ShapeAttributes(null);
                    shapeAttributes.interiorColor = WorldWind.Color.GREEN;
                    return {
                        attributes: shapeAttributes
                    };
                }
            },
            customCallbackLayer
        );
        wwd.addLayer(customCallbackLayer);

        // Allow for parsing of your own Well known text data
        var wktLayer = new WorldWind.RenderableLayer('WKT Custom');
        $('#showWkt').click(function(){
            new WorldWind.Wkt($('#wkt').val()).load(null, null, wktLayer);
        });
        wwd.addLayer(wktLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);
    });