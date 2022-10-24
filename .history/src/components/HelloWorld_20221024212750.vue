<template>

<div>

    <div id="demo"></div>

  </div>

</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	// function onWindowResize() {
 
	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();
 
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
 
	// }
export default {

  data() {

    return {

      mesh: [],

      renderer: null,

      scene: null,

      camera: null,
      hotData: []

    };

  },

  mounted() {
    this.getHotData()
    this.init();

  },

  methods: {
onWindowResize() {
 
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
 
		this.renderer.setSize( window.innerWidth, window.innerHeight );
 
	},
    getHotData() {
      let floorNum = 1
      let hotNum = 30
      for(let floor = 0; floor < floorNum; floor++) {
        this.hotData[floor] = []
        for(let i = 0; i <hotNum; i++) {
          let val = {
            x: Math.random() * 50,
            y: 0,
            z: Math.random() * 50,
            // z: 0,
            val: Math.random() * 30
          }
          this.hotData[floor].push(val)
        }
      }
    },
    init() {

      // 创建场景

      this.scene = new THREE.Scene();

      // 创建相机（第一个参数视野夹角0~180°，第二参数相机大小，第三，四参数可看像素）

      this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,1,1000);
      // 创建渲染器

      this.renderer = new THREE.WebGLRenderer();

      // 设置渲染器大小

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 拿到dom

      let demo = document.getElementById("demo");

      // 把渲染器放到dom中

      demo.appendChild(this.renderer.domElement);
      console.log(this.hotData)
      // 创建一个立方体(长，宽，高)
      for(let i = 0; i < this.hotData.length; i++) {
        for(let j = 0; j < this.hotData[i].length; j++) {
          let geometry = new THREE.BoxGeometry(10, this.hotData[i][j].val, 10);
    
          // 创建材料(定义立方体由这个材料组成)
    
          let material = new THREE.MeshBasicMaterial({
    
            color: 0xcccccc * Math.random(),
    
          });
    
          // 创建网格(合并立方体和材料)
          let currentIndex = i * this.hotData[i].length + j
          this.mesh[currentIndex] = new THREE.Mesh(geometry, material);
          // this.mesh
          // 将网格放入场景中
          this.mesh[currentIndex].position.x = this.hotData[i][j].x
          this.mesh[currentIndex].position.y = this.hotData[i][j].y
          this.mesh[currentIndex].position.z = this.hotData[i][j].z
          this.scene.add(this.mesh[currentIndex]);

        }
      }

      // 因默认情况相机与场景重合，需要先设定相机位置

      this.camera.position.z = 100;
      this.camera.position.x = 0;

      this.camera.position.y = 0;

      // 用渲染器渲染场景，相机

      this.renderer.render(this.scene, this.camera);

      let contorl = new OrbitControls(this.camera, this.renderer.domElement);
      console.log(contorl)
      this.onWindowResize()
      window.addEventListener('resize', this.onWindowResize, false);
      this.animate();

    },

    // 定义3D效果

    animate() {

      // 执行动画函数，执行完上一帧在执行下一帧

      requestAnimationFrame(this.animate);

      // this.mesh.rotation.x += 0.05;

      // // this.mesh.rotation.y += 0.05;

      // this.mesh.rotateY(0.01)
      
      this.renderer.render(this.scene, this.camera);

    },

  },

};

</script>

<style>

body {

  margin: 0;

  overflow: hidden;

  /* 隐藏body窗口区域滚动条 */

}

</style>