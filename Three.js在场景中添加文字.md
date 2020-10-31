#### Three.js在场景中添加文字

原理：采用Sprite（精灵）的方式，创建canvas，在其中输入文字，并将canvas设置为Sprite纹理

```jsx
public initText = () => {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d")
    // canvas.width = 800
    // canvas.height = 800
    // context!.scale(10, 10)
    drawRect(context); // 绘制矩形
    /* 字体颜色 */
    context!.fillStyle = "rgba(0,0,0,1)"
    // context!.font = "16px bold"
    /**文字 */
    context!.fillText("模型名称：", 10, 20)
    context!.fillText("我是模型", 100, 20)
    context!.fillText("模型：", 10, 40)
    context!.fillText("ABCDEFG", 100, 40)
    console.log(canvas)



    function drawRect(ctx: any) {
      ctx.strokeStyle = "#0864ee"
      ctx.strokeRect(0, 0, 680, 670)
      ctx.fillStyle = "rgba(10,18,51,0.8)"
      ctx.fillRect(1, 1, 678, 668)
    }

    var texture = new THREE.Texture(canvas) //就是上面的canvas，我将它写在一个函数中然后返回。
    texture.needsUpdate = true

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    var sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(400, 200, 200) //大小缩放
    sprite.position.set(-183, 0, 140) //位置

    this.group.add(sprite)

  }
```

