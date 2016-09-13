## LoopManager コンポーネント
<!-- EDIT HERE(@Component)-->
レンダリングループを管理するコンポーネントです。
loopEnabledがtrueである場合、自動的にそのブラウザのrequestAnimationFrameの際に処理を実行します。
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| loopEnabled | boolean | false | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### loopEnabled 属性

 * `converter`: boolean
 * `defaultValue`: false

<!-- EDIT HERE(loopEnabled)-->
ループが有効かどうか。
通常、この属性を編集する必要はありません。AssetLoadingManagerコンポーネントがロード終了時に自動的にtrueにマークします。
<!-- /EDIT HERE-->
