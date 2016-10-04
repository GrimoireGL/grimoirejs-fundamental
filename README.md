
## AssetLoadingManager コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| loadingProgress | Number | 0 | なし |
| autoStart | Boolean | true | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### loadingProgress 属性

 * `converter`: Number
 * `defaultValue`: 0

<!-- EDIT HERE(loadingProgress)-->
<!-- /EDIT HERE-->
### autoStart 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(autoStart)-->
<!-- /EDIT HERE-->

## Camera コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| fovy | Number | 0.3 | なし |
| near | Number | 0.01 | なし |
| far | Number | 10 | なし |
| aspect | Number | 1.6 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### fovy 属性

 * `converter`: Number
 * `defaultValue`: 0.3

<!-- EDIT HERE(fovy)-->
<!-- /EDIT HERE-->
### near 属性

 * `converter`: Number
 * `defaultValue`: 0.01

<!-- EDIT HERE(near)-->
<!-- /EDIT HERE-->
### far 属性

 * `converter`: Number
 * `defaultValue`: 10

<!-- EDIT HERE(far)-->
<!-- /EDIT HERE-->
### aspect 属性

 * `converter`: Number
 * `defaultValue`: 1.6

<!-- EDIT HERE(aspect)-->
<!-- /EDIT HERE-->

## CanvasInitializer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| width | Number | 640 | なし |
| height | Number | 480 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### width 属性

 * `converter`: Number
 * `defaultValue`: 640

<!-- EDIT HERE(width)-->
<!-- /EDIT HERE-->
### height 属性

 * `converter`: Number
 * `defaultValue`: 480

<!-- EDIT HERE(height)-->
<!-- /EDIT HERE-->

## Geometry コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| type | String | undefined | なし |
| name | String | undefined | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### type 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(type)-->
<!-- /EDIT HERE-->
### name 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(name)-->
<!-- /EDIT HERE-->

## GeometryRegistory コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| defaultGeometry | StringArray | ["quad", "cube", "sphere"] | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### defaultGeometry 属性

 * `converter`: StringArray
 * `defaultValue`: ["quad", "cube", "sphere"]

<!-- EDIT HERE(defaultGeometry)-->
<!-- /EDIT HERE-->

## LoopManager コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| loopEnabled | Boolean | false | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### loopEnabled 属性

 * `converter`: Boolean
 * `defaultValue`: false

<!-- EDIT HERE(loopEnabled)-->
<!-- /EDIT HERE-->

## Material コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| type | String | undefined | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### type 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(type)-->
<!-- /EDIT HERE-->

## MaterialContainer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| material | Material | undefined | `componentBoundTo`</br> "_materialComponent" </br>    </br>  </br> |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### material 属性

 * `converter`: Material
 * `defaultValue`: undefined

<!-- EDIT HERE(material)-->
<!-- /EDIT HERE-->

## MaterialImporter コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| type | String | undefined | なし |
| src | String | undefined | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### type 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(type)-->
<!-- /EDIT HERE-->
### src 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(src)-->
<!-- /EDIT HERE-->

## MaterialManager コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
属性なし
## MeshRenderer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| geometry | Geometry | "quad" | なし |
| targetBuffer | String | "default" | なし |
| layer | String | "default" | なし |
| drawCount | Number | Number.MAX_VALUE | なし |
| drawOffset | Number | 0 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### geometry 属性

 * `converter`: Geometry
 * `defaultValue`: "quad"

<!-- EDIT HERE(geometry)-->
<!-- /EDIT HERE-->
### targetBuffer 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(targetBuffer)-->
<!-- /EDIT HERE-->
### layer 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(layer)-->
<!-- /EDIT HERE-->
### drawCount 属性

 * `converter`: Number
 * `defaultValue`: Number.MAX_VALUE

<!-- EDIT HERE(drawCount)-->
<!-- /EDIT HERE-->
### drawOffset 属性

 * `converter`: Number
 * `defaultValue`: 0

<!-- EDIT HERE(drawOffset)-->
<!-- /EDIT HERE-->

## MouseCameraControl コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| rotateX | Number | 1 | なし |
| rotateY | Number | 1 | なし |
| moveZ | Number | 1 | なし |
| moveSpeed | Number | 1 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### rotateX 属性

 * `converter`: Number
 * `defaultValue`: 1

<!-- EDIT HERE(rotateX)-->
<!-- /EDIT HERE-->
### rotateY 属性

 * `converter`: Number
 * `defaultValue`: 1

<!-- EDIT HERE(rotateY)-->
<!-- /EDIT HERE-->
### moveZ 属性

 * `converter`: Number
 * `defaultValue`: 1

<!-- EDIT HERE(moveZ)-->
<!-- /EDIT HERE-->
### moveSpeed 属性

 * `converter`: Number
 * `defaultValue`: 1

<!-- EDIT HERE(moveSpeed)-->
<!-- /EDIT HERE-->

## RenderBuffer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| name | String | undefined | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### name 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(name)-->
<!-- /EDIT HERE-->

## Renderer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| camera | Component | "camera" | `target`</br> "CAMERA"</br>    </br> |
| viewport | Viewport | "auto" | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### camera 属性

 * `converter`: Component
 * `defaultValue`: "camera"

<!-- EDIT HERE(camera)-->
<!-- /EDIT HERE-->
### viewport 属性

 * `converter`: Viewport
 * `defaultValue`: "auto"

<!-- EDIT HERE(viewport)-->
<!-- /EDIT HERE-->

## RendererManager コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| bgColor | Color4 | new Color4(0, 0, 0, 0) | なし |
| clearDepth | Number | 1.0 | なし |
| complementRenderer | Boolean | true | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### bgColor 属性

 * `converter`: Color4
 * `defaultValue`: new Color4(0, 0, 0, 0)

<!-- EDIT HERE(bgColor)-->
<!-- /EDIT HERE-->
### clearDepth 属性

 * `converter`: Number
 * `defaultValue`: 1.0

<!-- EDIT HERE(clearDepth)-->
<!-- /EDIT HERE-->
### complementRenderer 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(complementRenderer)-->
<!-- /EDIT HERE-->

## RenderQuad コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| out | String | "default" | なし |
| depthBuffer | String | undefined | なし |
| targetBuffer | String | "default" | なし |
| clearColor | Color4 | "#0000" | なし |
| clearColorEnabled | Boolean | true | なし |
| clearDepthEnabled | Boolean | true | なし |
| clearDepth | Number | 1.0 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### out 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(out)-->
<!-- /EDIT HERE-->
### depthBuffer 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(depthBuffer)-->
<!-- /EDIT HERE-->
### targetBuffer 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(targetBuffer)-->
<!-- /EDIT HERE-->
### clearColor 属性

 * `converter`: Color4
 * `defaultValue`: "#0000"

<!-- EDIT HERE(clearColor)-->
<!-- /EDIT HERE-->
### clearColorEnabled 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(clearColorEnabled)-->
<!-- /EDIT HERE-->
### clearDepthEnabled 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(clearDepthEnabled)-->
<!-- /EDIT HERE-->
### clearDepth 属性

 * `converter`: Number
 * `defaultValue`: 1.0

<!-- EDIT HERE(clearDepth)-->
<!-- /EDIT HERE-->

## RenderScene コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| layer | String | "default" | なし |
| depthBuffer | String | undefined | なし |
| out | String | "default" | なし |
| clearColor | Color4 | "#0000" | なし |
| clearColorEnabled | Boolean | true | なし |
| clearDepthEnabled | Boolean | true | なし |
| clearDepth | Number | 1.0 | なし |
| material | Material | undefined | `componentBoundTo`</br> "_materialComponent"</br>    </br> |
| camera | Component | undefined | `target`</br> "CAMERA"</br>    </br>  </br> |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### layer 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(layer)-->
<!-- /EDIT HERE-->
### depthBuffer 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(depthBuffer)-->
<!-- /EDIT HERE-->
### out 属性

 * `converter`: String
 * `defaultValue`: "default"

<!-- EDIT HERE(out)-->
<!-- /EDIT HERE-->
### clearColor 属性

 * `converter`: Color4
 * `defaultValue`: "#0000"

<!-- EDIT HERE(clearColor)-->
<!-- /EDIT HERE-->
### clearColorEnabled 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(clearColorEnabled)-->
<!-- /EDIT HERE-->
### clearDepthEnabled 属性

 * `converter`: Boolean
 * `defaultValue`: true

<!-- EDIT HERE(clearDepthEnabled)-->
<!-- /EDIT HERE-->
### clearDepth 属性

 * `converter`: Number
 * `defaultValue`: 1.0

<!-- EDIT HERE(clearDepth)-->
<!-- /EDIT HERE-->
### material 属性

 * `converter`: Material
 * `defaultValue`: undefined

<!-- EDIT HERE(material)-->
<!-- /EDIT HERE-->
### camera 属性

 * `converter`: Component
 * `defaultValue`: undefined

<!-- EDIT HERE(camera)-->
<!-- /EDIT HERE-->

## Scene コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
属性なし
## Texture コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| src | String | undefined | なし |
| minFilter | Enum | "LINEAR" | `table`</br> </br>        LINEAR: WebGLRenderingContext.LINEAR,</br>        NEAREST: WebGLRenderingContext.NEAREST,</br>        NEAREST_MIPMAP_NEAREST: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,</br>        NEAREST_MIPMAP_LINEAR: WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,</br>        LINEAR_MIPMAP_NEAREST: WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,</br>        LINEAR_MIPMAP_LINEAR: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR</br>      </br>    </br> |
| magFilter | Enum | "LINEAR" | `table`</br> </br>        LINEAR: WebGLRenderingContext.LINEAR,</br>        NEAREST: WebGLRenderingContext.NEAREST</br>      </br>    </br> |
| wrapS | Enum | "REPEAT" | `table`</br> </br>        REPEAT: WebGLRenderingContext.REPEAT,</br>        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,</br>        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE</br>      </br>    </br> |
| wrapT | Enum | "REPEAT" | `table`</br> </br>        REPEAT: WebGLRenderingContext.REPEAT,</br>        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,</br>        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE</br>      </br>    </br>  </br> |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### src 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(src)-->
<!-- /EDIT HERE-->
### minFilter 属性

 * `converter`: Enum
 * `defaultValue`: "LINEAR"

<!-- EDIT HERE(minFilter)-->
<!-- /EDIT HERE-->
### magFilter 属性

 * `converter`: Enum
 * `defaultValue`: "LINEAR"

<!-- EDIT HERE(magFilter)-->
<!-- /EDIT HERE-->
### wrapS 属性

 * `converter`: Enum
 * `defaultValue`: "REPEAT"

<!-- EDIT HERE(wrapS)-->
<!-- /EDIT HERE-->
### wrapT 属性

 * `converter`: Enum
 * `defaultValue`: "REPEAT"

<!-- EDIT HERE(wrapT)-->
<!-- /EDIT HERE-->

## TextureBuffer コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| name | String | undefined | なし |
| format | Enum | WebGLRenderingContext.RGBA | `table`</br> </br>        RGBA: WebGLRenderingContext.RGBA,</br>        RGB: WebGLRenderingContext.RGB</br>      </br>    </br>  </br> |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### name 属性

 * `converter`: String
 * `defaultValue`: undefined

<!-- EDIT HERE(name)-->
<!-- /EDIT HERE-->
### format 属性

 * `converter`: Enum
 * `defaultValue`: WebGLRenderingContext.RGBA

<!-- EDIT HERE(format)-->
<!-- /EDIT HERE-->

## Transform コンポーネント
<!-- EDIT HERE(@Component)-->
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| "position" | Vector3 | Vector3.Zero | なし |
| "rotation" | Rotation3 | Quaternion.Identity | なし |
| "scale" | Vector3 | Vector3.One | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### "position" 属性

 * `converter`: Vector3
 * `defaultValue`: Vector3.Zero

<!-- EDIT HERE("position")-->
<!-- /EDIT HERE-->
### "rotation" 属性

 * `converter`: Rotation3
 * `defaultValue`: Quaternion.Identity

<!-- EDIT HERE("rotation")-->
<!-- /EDIT HERE-->
### "scale" 属性

 * `converter`: Vector3
 * `defaultValue`: Vector3.One

<!-- EDIT HERE("scale")-->
<!-- /EDIT HERE-->

