## AssetLoadingManager コンポーネント
<!-- EDIT HERE(@Component)-->
非同期的な解決を必要とするようなリソース群のロードを管理しているコンポーネント。
このコンポーネントにより、初期時にロード画面を表示します。
また、ロード終了後に他のコンポーネントに処理の開始を通知してレンダリングループを開始します。
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| loadingProgress | number | 0 | なし |
| autoStart | boolean | true | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### loadingProgress 属性

 * `converter`: number
 * `defaultValue`: 0

<!-- EDIT HERE(loadingProgress)-->
読み取り専用。現在のロード状況を100分率で返します。
<!-- /EDIT HERE-->
### autoStart 属性

 * `converter`: boolean
 * `defaultValue`: true

<!-- EDIT HERE(autoStart)-->
リソースのロード終了後に自動的にレンダリングループを開始するかどうか。
これがfalseの場合、ユーザーが自らLoopManagerに対してbeginメソッドを呼ばなければ、一切の描画処理は行われません。
<!-- /EDIT HERE-->
