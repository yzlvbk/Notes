#### Three.js设置线条宽度

在编写Three.js程序的时候，你设置线模型`Line`对应线材质`LineBasicMaterial`的线宽属性`.lineWidth`，是无效的。

以下是vue中设置three.js线条宽度：

##### 1.导入three.js

```javascript
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
```

##### 2.创建线条模型

```javascript
var geometry = new LineGeometry()
var pointArr = [
        -100, 0, 0,
        -100, 100, 0,
        0, 0, 0,
        100, 100, 0,
        100, 0, 0
      ]
geometry.setPositions(pointArr)
var material = new LineMaterial({
        color: 0xffffff,
        linewidth: 5
      })
material.resolution.set(window.innerWidth, window.innerHeight)
var line = new Line2(geometry, material)
line.computeLineDistances()
scene.add(line)
```



