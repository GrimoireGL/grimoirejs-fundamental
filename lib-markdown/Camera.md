## Camera コンポーネント
<!-- EDIT HERE(@Component)-->

シーンの描画をするカメラの役割をするコンポーネントです。
シーン中の物体を描画する際にこのコンポーネントにより生成されたビュー行列や射影行列が用いられます。

<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| fovy | number | 0.3 | なし |
| near | number | 0.01 | なし |
| far | number | 10 | なし |
| aspect | number | 1.6 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### fovy 属性

 * `converter`: number
 * `defaultValue`: 0.3

<!-- EDIT HERE(fovy)-->
視野角。ラジアン単位で指定します。
1/2π以上の値は指定できません。
<!-- /EDIT HERE-->
### near 属性

 * `converter`: number
 * `defaultValue`: 0.01

<!-- EDIT HERE(near)-->
近クリップ面(カメラから物体が映る最短の距離)を指定します。
必ず、正の値を指定する必要があります。
<!-- /EDIT HERE-->
### far 属性

 * `converter`: number
 * `defaultValue`: 10

<!-- EDIT HERE(far)-->
遠クリップ面(カメラから物体が映る最長の距離)を指定します。
遠ければ遠いほどいいわけではなく、近クリップ面との差があまりにも大きすぎると、物体の前後関係が曖昧になってしまう場所が発生し得ます。
<!-- /EDIT HERE-->
### aspect 属性

 * `converter`: number
 * `defaultValue`: 1.6

<!-- EDIT HERE(aspect)-->
スクリーン上のアスペクト比を指定します。
<!-- /EDIT HERE-->
