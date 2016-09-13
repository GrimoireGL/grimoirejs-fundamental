## CanvasInitializer コンポーネント
<!-- EDIT HERE(@Component)-->
キャンバスの初期化を司るコンポーネントです。
このコンポーネントに対してtreeInitializedが呼ばれた瞬間にスクリプトタグの存在した場所に対して`<canvas>`タグの生成を試みます。
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| width | number | 640 | なし |
| height | number | 480 | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### width 属性

 * `converter`: number
 * `defaultValue`: 640

<!-- EDIT HERE(width)-->
キャンバスの幅を指します。
<!-- /EDIT HERE-->
### height 属性

 * `converter`: number
 * `defaultValue`: 480

<!-- EDIT HERE(height)-->
キャンバスの高さを指します。
<!-- /EDIT HERE-->
