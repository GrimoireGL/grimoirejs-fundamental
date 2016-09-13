## Geometry コンポーネント
<!-- EDIT HERE(@Component)-->
あるプリミティブなどのジオメトリを含まれているGOML内でで使用可能にします。
このコンポーネントは`type`属性に合わせて必要な属性値を動的に生成します。
<!-- /EDIT HERE-->
### 属性
<!-- DO NOT EDIT -->
<!-- ATTRS -->
| 属性名 | コンバーター | デフォルト値 | その他 |
|:------:|:------:|:------:|:------:|
| type | string | undefined | なし |
| name | string | undefined | なし |

<!-- /ATTRS -->
<!-- /DO NOT EDIT -->
### type 属性

 * `converter`: string
 * `defaultValue`: undefined

<!-- EDIT HERE(type)-->
生成するジオメトリのタイプです。任意のジオメトリを`GeometryFactory.addType`から追加することによりユーザーが独自のパラメーターを割り当てたジオメトリを作成することができます。
<!-- /EDIT HERE-->
### name 属性

 * `converter`: string
 * `defaultValue`: undefined

<!-- EDIT HERE(name)-->
生成したジオメトリにつける名前です。これを用いて`GeometryConverter`は対象となるジオメトリを識別します。
例えば、`MeshRenderer`の`geometry`属性などに指定する名前になります。
<!-- /EDIT HERE-->
