## 概要



## インストール

```sh
$ npm install grimoirejs-fundamental --save
```

[unpkg.com](https://unpkg.com)によるCDNも利用可能。

** [CDN - grimoirejs-fundamental - ](https://unpkg.com/grimoirejs-fundamental/register/grimoire-fundamental.js) **

## 一覧

### ノード

  |ノード名|説明|
  |:-:|:-:|

### コンポーネント

  |コンポーネント名|説明|
  |:-:|:-:|
  |[`<AssetLoadingManagerComponent>`](#AssetLoadingManagerComponentコンポーネント)|アセットの読み込みを司るコンポーネント。ローダーの表示などを司る。|
  |[`<CameraComponent>`](#CameraComponentコンポーネント)|このコンポーネントによって、透視射影や正方射影などの歪みを調整します。|
  |[`<CanvasInitializerComponent>`](#CanvasInitializerComponentコンポーネント)|このコンポーネントによって、適切な位置に`<canvas>`を初期化してWebGLコンテキストを初期化します。|
  |[`<FullscreenComponent>`](#FullscreenComponentコンポーネント)|Grimoire.jsによって管理されているキャンバス(正確にはその親のコンテナ)のフルスクリーン状態等を管理します。|
  |[`<GeometryComponent>`](#GeometryComponentコンポーネント)|`type`属性に指定されたタイプのジオメトリを生成して、`name`属性に指定された名前で利用できる形にして登録します。|
  |[`<GeometryRegistoryComponent>`](#GeometryRegistoryComponentコンポーネント)|あまりユーザーが直接操作することはありません。|
  |[`<HTMLBinderComponent>`](#HTMLBinderComponentコンポーネント)|このコンポーネントはfundamentalからは削除されます。(別のパッケージとして分離予定)|
  |[`<LoopManagerComponent>`](#LoopManagerComponentコンポーネント)|全体のループを管理しているコンポーネント。あまり直接ユーザーがいじることはありません。|
  |[`<MaterialComponent>`](#MaterialComponentコンポーネント)||
  |[`<MaterialContainerComponent>`](#MaterialContainerComponentコンポーネント)|このコンポーネントは将来的に`MeshRenderer`と統合されます。|
  |[`<MaterialImporterComponent>`](#MaterialImporterComponentコンポーネント)|マテリアル設定ファイルを読み込むためのコンポーネント|
  |[`<MouseCameraControlComponent>`](#MouseCameraControlComponentコンポーネント)||
  |[`<RenderBufferComponent>`](#RenderBufferComponentコンポーネント)||
  |[`<RendererComponent>`](#RendererComponentコンポーネント)||
  |[`<RendererManagerComponent>`](#RendererManagerComponentコンポーネント)|全レンダラーを管理するためのコンポーネント|
  |[`<RenderQuadComponent>`](#RenderQuadComponentコンポーネント)||
  |[`<RenderSceneComponent>`](#RenderSceneComponentコンポーネント)||
  |[`<SceneComponent>`](#SceneComponentコンポーネント)|このコンポーネントには属性が存在しません。|
  |[`<TextureBufferComponent>`](#TextureBufferComponentコンポーネント)||
  |[`<TextureComponent>`](#TextureComponentコンポーネント)||
  |[`<TransformComponent>`](#TransformComponentコンポーネント)|このコンポーネントによって物体の座標や回転量、拡大料などが定義されます。|

### コンバーター

  |コンバーター名|説明|
  |:-:|:-:|
  |[`CanvasSizeConverter`](#CanvasSizeConverterコンバーター)||
  |[`GeometryConverter`](#GeometryConverterコンバーター)||
  |[`MaterialConverter`](#MaterialConverterコンバーター)||
  |[`NodeConverter`](#NodeConverterコンバーター)||
  |[`PositionConverter`](#PositionConverterコンバーター)||
  |[`TextureConverter`](#TextureConverterコンバーター)||
  |[`ViewportConverter`](#ViewportConverterコンバーター)||

## ノード詳細




## コンポーネント詳細


### AssetLoadingManagerComponentコンポーネント


アセットの読み込みを司るコンポーネント。ローダーの表示などを司る。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|loadingProgress|Number|現在の読み込み状況を0-1で表す。|
|autoStart|Boolean|リソースの読み込み完了後に、自動的にレンダリングループを開始するかどうか|
|enableLoader|Boolean|リソースのロード時にローディング画面を表示するかどうか|


##### loadingProgress属性

**初期値** ・・・ `0`  
**コンバーター** ・・・ `Number`



現在の読み込み状況を0-1で表す。


##### autoStart属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`

リソースの読み込み完了後に、自動的にレンダリングループを開始するかどうか


##### enableLoader属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`

リソースのロード時にローディング画面を表示するかどうか



### CameraComponentコンポーネント




このコンポーネントによって、透視射影や正方射影などの歪みを調整します。
また、このコンポーネントの付属するノードに属する`Transoform`によって、カメラの位置や向きが確定されます。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|fovy|Angle2D|カメラの視野角。|
|near|Number|カメラに映るもっとも近い距離です。|
|far|Number|far - nearの値があまりにも大きいと、Z-fighting(手前の物体が奥に表示されたように見えたりする)現象が起きる可能性があります。|
|aspect|Number|カメラのアスペクト比|
|autoAspect|Boolean|アスペクト比の自動調整が有効か否か|
|orthoSize|Number|正射影時の横の基準サイズ|
|orthogonal|Boolean|この属性がfalseである場合、カメラは透視射影としてシーンをレンダリングします。この場合、レンダリング結果にパース(奥行き感)が出ます。|


##### fovy属性

**初期値** ・・・ `45d`  
**コンバーター** ・・・ `Angle2D`

カメラの視野角。
orthogonal属性がtrueである場合この属性は無視されます。


##### near属性

**初期値** ・・・ `0.01`  
**コンバーター** ・・・ `Number`

カメラに映るもっとも近い距離です。
0よりも大きく、far属性よりも小さい必要があります。


##### far属性

**初期値** ・・・ `100`  
**コンバーター** ・・・ `Number`



far - nearの値があまりにも大きいと、Z-fighting(手前の物体が奥に表示されたように見えたりする)現象が起きる可能性があります。
この差があまりに大きい時、カメラに映る物体の座標の小さいz座標の値の差は0に近似されます。
逆にこの値が小さい時は、カメラに映る物体はある程度小さいz座標の差でも問題なく表示されます。
**大切なのは、写したい空間よりも無駄に大きくしないこと。常に適切な値を設定するべきです**


##### aspect属性

**初期値** ・・・ `1.6`  
**コンバーター** ・・・ `Number`

カメラのアスペクト比
カメラの横の大きさと縦の大きさの比率を指定します。autoAspect属性がtrueである時、毎回のレンダリング時にこの値を自動調整します。


##### autoAspect属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`

アスペクト比の自動調整が有効か否か
レンダリング時にそのビューポートの大きさに応じて比率を自動調整するかどうかを示します。


##### orthoSize属性

**初期値** ・・・ `100`  
**コンバーター** ・・・ `Number`

正射影時の横の基準サイズ
正射影時はfovy属性を用いて自動的に写す領域を決定できません。
そのため、横の一片のサイズをこの属性で指定します。**アスペクト比は計算に用いられることに注意してください。**


##### orthogonal属性

**初期値** ・・・ `false`  
**コンバーター** ・・・ `Boolean`



この属性がfalseである場合、カメラは透視射影としてシーンをレンダリングします。この場合、レンダリング結果にパース(奥行き感)が出ます。
一方、この属性がtrueである場合、カメラは正射影としてシーンをレンダリングします。この場合、レンダリング結果には奥行き感は出ません。



### CanvasInitializerComponentコンポーネント




このコンポーネントによって、適切な位置に`<canvas>`を初期化してWebGLコンテキストを初期化します。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|width|CanvasSize|キャンバスタグの横幅を指定します。|
|height|CanvasSize|キャンバスタグの縦幅を指定します。|
|containerId|String|キャンバス要素の直接の親要素のコンテナに割り当てるidを指定します。|
|containerClass|String|キャンバス要素の直接の親要素のコンテナに割り当てるクラス名を指定します。|
|preserveDrawingBuffer|Boolean|描画結果をdataURLに変換する際などはこの属性がtrueでないと正常にレンダリング結果を取得できません。|
|antialias|Boolean|この属性は、途中で動的に変更することができません。|


##### width属性

**初期値** ・・・ `fit`  
**コンバーター** ・・・ `CanvasSize`

キャンバスタグの横幅を指定します。


##### height属性

**初期値** ・・・ `fit`  
**コンバーター** ・・・ `CanvasSize`

キャンバスタグの縦幅を指定します。


##### containerId属性

**初期値** ・・・ ``  
**コンバーター** ・・・ `String`

キャンバス要素の直接の親要素のコンテナに割り当てるidを指定します。


##### containerClass属性

**初期値** ・・・ `gr-container`  
**コンバーター** ・・・ `String`

キャンバス要素の直接の親要素のコンテナに割り当てるクラス名を指定します。


##### preserveDrawingBuffer属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`



描画結果をdataURLに変換する際などはこの属性がtrueでないと正常にレンダリング結果を取得できません。


##### antialias属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`



この属性は、途中で動的に変更することができません。



### FullscreenComponentコンポーネント




Grimoire.jsによって管理されているキャンバス(正確にはその親のコンテナ)のフルスクリーン状態等を管理します。
(他の要素をフルスクリーン化することも可能ですが、通常このGrimoire.jsによって生成されるキャンバスを含むDOM要素に対して用いられます。)

また、一部の古いブラウザでは動作しない機能であることに注意してください。
また、`fullscreen`属性は必ず マウスのイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで **動的に** trueにされる必要があります。

最初からtrueに設定して初期状態でキャンバスをフルスクリーン状態にすることはWebAPIの制約上できません。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|fullscreen|Boolean|このフラグをtrueにする際は、**必ず**、マウスイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで変更されなければなりません。|
|fullscreenTarget|String|nullが指定された場合、キャンバスの親要素が用いられます。|


##### fullscreen属性

**初期値** ・・・ `false`  
**コンバーター** ・・・ `Boolean`



このフラグをtrueにする際は、**必ず**、マウスイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで変更されなければなりません。

したがって、GOMLで初期状態からこのフラグをtrueにすることはできません。


##### fullscreenTarget属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`



nullが指定された場合、キャンバスの親要素が用いられます。



### GeometryComponentコンポーネント




`type`属性に指定されたタイプのジオメトリを生成して、`name`属性に指定された名前で利用できる形にして登録します。

このコンポーネントは`type`属性に応じて、**動的** に属性が増えることに気をつけてください。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|type|String|`GeometryFactory`に登録されたプリミティブのジェネレーターの名前を指します。|
|name|String|`GeometryConverter`によって取得される際に利用されるジオメトリ名です。|


##### type属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`



`GeometryFactory`に登録されたプリミティブのジェネレーターの名前を指します。
この指定する名前によって、動的に属性が増えることに気をつけてください。
また、増えたジオメトリの属性は動的に操作できないことに気をつけてください。


##### name属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`



`GeometryConverter`によって取得される際に利用されるジオメトリ名です。
もし、`quad`など事前に登録されたジオメトリを指定した場合、そのジオメトリを上書きすることができます。



### GeometryRegistoryComponentコンポーネント




あまりユーザーが直接操作することはありません。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|defaultGeometry|StringArray|デフォルトで生成するジオメトリの種類|


##### defaultGeometry属性

**初期値** ・・・ `quad,cube,sphere`  
**コンバーター** ・・・ `StringArray`

デフォルトで生成するジオメトリの種類



### HTMLBinderComponentコンポーネント




このコンポーネントはfundamentalからは削除されます。(別のパッケージとして分離予定)

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|htmlQuery|String||
|targetRenderer|String||


##### htmlQuery属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`




##### targetRenderer属性

**初期値** ・・・ `render-scene`  
**コンバーター** ・・・ `String`





### LoopManagerComponentコンポーネント


全体のループを管理しているコンポーネント。あまり直接ユーザーがいじることはありません。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|loopEnabled|Boolean||


##### loopEnabled属性

**初期値** ・・・ `false`  
**コンバーター** ・・・ `Boolean`





### MaterialComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|type|String||


##### type属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`





### MaterialContainerComponentコンポーネント




このコンポーネントは将来的に`MeshRenderer`と統合されます。
指定されたマテリアルの初期化の管理や、マテリアルによって動的に追加される属性の管理を行います、

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|material|Material|対象のマテリアル|
|drawOrder|String|デフォルトの状態では、マテリアルから読み込んだ描画順序設定を用います|


##### material属性

**初期値** ・・・ `new(unlit)`  
**コンバーター** ・・・ `Material`

対象のマテリアル


##### drawOrder属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`



デフォルトの状態では、マテリアルから読み込んだ描画順序設定を用います



### MaterialImporterComponentコンポーネント


マテリアル設定ファイルを読み込むためのコンポーネント

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|typeName|String|マテリアル名として登録される名前|
|src|String|読み込み先のファイルパス|


##### typeName属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`

マテリアル名として登録される名前


##### src属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`

読み込み先のファイルパス



### MouseCameraControlComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|rotateSpeed|Number||
|zoomSpeed|Number||
|moveSpeed|Number||
|center|Position||
|distance|Number||


##### rotateSpeed属性

**初期値** ・・・ `1`  
**コンバーター** ・・・ `Number`




##### zoomSpeed属性

**初期値** ・・・ `1`  
**コンバーター** ・・・ `Number`




##### moveSpeed属性

**初期値** ・・・ `1`  
**コンバーター** ・・・ `Number`




##### center属性

**初期値** ・・・ `0,0,0`  
**コンバーター** ・・・ `Position`




##### distance属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `Number`





### RenderBufferComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|name|String||


##### name属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`





### RendererComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|camera|Component||
|viewport|Viewport||


##### camera属性

**初期値** ・・・ `camera`  
**コンバーター** ・・・ `Component`




##### viewport属性

**初期値** ・・・ `auto`  
**コンバーター** ・・・ `Viewport`





### RendererManagerComponentコンポーネント


全レンダラーを管理するためのコンポーネント

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|



### RenderQuadComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|out|String||
|depthBuffer|String||
|targetBuffer|String||
|clearColor|Color4||
|clearColorEnabled|Boolean||
|clearDepthEnabled|Boolean||
|clearDepth|Number||
|technique|String||


##### out属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`




##### depthBuffer属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`




##### targetBuffer属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`




##### clearColor属性

**初期値** ・・・ `#0000`  
**コンバーター** ・・・ `Color4`




##### clearColorEnabled属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`




##### clearDepthEnabled属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`




##### clearDepth属性

**初期値** ・・・ `1`  
**コンバーター** ・・・ `Number`




##### technique属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`





### RenderSceneComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|layer|String||
|depthBuffer|String||
|out|String||
|clearColor|Color4||
|clearColorEnabled|Boolean||
|clearDepthEnabled|Boolean||
|clearDepth|Number||
|camera|Component||
|technique|String||


##### layer属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`




##### depthBuffer属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `String`




##### out属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`




##### clearColor属性

**初期値** ・・・ `#0000`  
**コンバーター** ・・・ `Color4`




##### clearColorEnabled属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`




##### clearDepthEnabled属性

**初期値** ・・・ `true`  
**コンバーター** ・・・ `Boolean`




##### clearDepth属性

**初期値** ・・・ `1`  
**コンバーター** ・・・ `Number`




##### camera属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `Component`




##### technique属性

**初期値** ・・・ `default`  
**コンバーター** ・・・ `String`





### SceneComponentコンポーネント




このコンポーネントには属性が存在しません。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|



### TextureBufferComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|



### TextureComponentコンポーネント




#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|



### TransformComponentコンポーネント




このコンポーネントによって物体の座標や回転量、拡大料などが定義されます。
シーン中の全ての物体は必ずこのコンポーネントを含まなければなりません。

#### 属性

|名前|コンバーター|詳細|
|:-:|:-:|:-:|
|position|Vector3|この物体の座標|
|rotation|Rotation3|この物体の回転量|
|scale|Vector3|この物体の拡大率|
|rawMatrix|Object|利用されません|


##### position属性

**初期値** ・・・ `0,0,0`  
**コンバーター** ・・・ `Vector3`

この物体の座標


##### rotation属性

**初期値** ・・・ `0,0,0,1`  
**コンバーター** ・・・ `Rotation3`

この物体の回転量


##### scale属性

**初期値** ・・・ `1,1,1`  
**コンバーター** ・・・ `Vector3`

この物体の拡大率


##### rawMatrix属性

**初期値** ・・・ `null`  
**コンバーター** ・・・ `Object`

利用されません




## コンバーター詳細

### CanvasSizeConverterコンバーター



### GeometryConverterコンバーター



### MaterialConverterコンバーター



### NodeConverterコンバーター



### PositionConverterコンバーター



### TextureConverterコンバーター



### ViewportConverterコンバーター





undefined
