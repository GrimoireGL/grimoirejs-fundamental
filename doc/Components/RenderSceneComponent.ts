{
	"nodes": [],
	"components": [
		{
			"name": "RenderSceneComponent",
			"description": "",
			"attributes": {
				"layer": {
					"converter": "String",
					"default": "default",
					"description": ""
				},
				"depthBuffer": {
					"default": "null",
					"converter": "String",
					"description": ""
				},
				"out": {
					"converter": "String",
					"default": "default",
					"description": ""
				},
				"clearColor": {
					"default": "#0000",
					"converter": "Color4",
					"description": ""
				},
				"clearColorEnabled": {
					"default": "true",
					"converter": "Boolean",
					"description": ""
				},
				"clearDepthEnabled": {
					"default": "true",
					"converter": "Boolean",
					"description": ""
				},
				"clearDepth": {
					"default": "1",
					"converter": "Number",
					"description": ""
				},
				"camera": {
					"default": "null",
					"converter": "Component",
					"target": "Camera",
					"description": ""
				},
				"technique": {
					"default": "default",
					"converter": "String",
					"description": ""
				}
			}
		}
	],
	"converters": []
}