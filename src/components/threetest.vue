<template>
    <div>
    
        <div id="container"></div>
    
      </div>
    
</template>
    
    <script>
    import * as THREE from 'three';
    // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
    import stats from 'three/examples/jsm/libs/stats.module.js';
    import  * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
    // import tween from "./plugins/tween";
    export default {
      name: 'threeTest',
      data() {
        return {
          container: null,
          stats: null,
          camera: null,
        //   renderer: null,
          controls: null,
          scene: null,
          renderer: null,
          pickingTexture: null,
          // scene: null,
          highlightBox: null,
          objects: null,
          step: 0,
          tween: null,
          tweenback: null,
          pickingData: [],
          quaternion: null,
          matrix: null,
          color: null,
          geometriesDrawn: [],
          geometriesPicking: [],
          colorArray: ['0xff0000', '0xffff00', '0x00ffff', '0x0000ff'],
          testData: [[31.289317,121.498510],
[31.342570,121.460905],
[31.132883,121.480387],
[31.203175,121.515078],
[31.128925,121.502548],
[31.120655,121.440198],
[31.352872,121.491077],
[31.168040,121.476833],
[31.129310,121.363663],
[31.050600,121.741020],
[31.262440,121.473422],
[31.262613,121.473283],
[31.263105,121.472667],
[31.348812,121.426638],
[31.233362,121.482008],
[31.204125,121.620745],
[31.321715,121.524422]]
        };
      },
      mounted() {
        let _this = this
        window.tweenupdate = function(cube) {
            cube.scale.y = _this.scale
          }
        this.init();
		this.animate();
        console.log(this.createPosition([31.262440,121.473422]))
      },
    
      methods: {
        createPosition(lnglat) {
          let spherical = new THREE.Spherical
          spherical.radius = 100;
          const lng = lnglat[1]
          const lat = lnglat[0]
          const theta = (lng + 90) * (Math.PI / 180)
          const phi = (90 - lat) * (Math.PI / 180)
          spherical.phi = phi; // phi是方位面（水平面）内的角度，范围0~360度
          spherical.theta = theta; // theta是俯仰面（竖直面）内的角度，范围0~180度
          let position = new THREE.Vector3()
          position.setFromSpherical(spherical)
          return position
        },
		animate() {
          requestAnimationFrame( this.animate );
          this.render();
          this.stats.update();
		},
        initTween(objects) {
          var position = { scale: 0 };
          this.tween = new this.$tweener.Tween(position);
          this.tween.to({ scale: 1 }, 1500);
          this.tween.easing(this.$tweener.Easing.Sinusoidal.InOut);
          let tweenupdate = function() {
            objects.scale.y = position.scale
          }
          this.tween.onUpdate(tweenupdate);

          this.tween.start();
        },
		render() {
          this.controls.update();
          this.step += 0.05;
          if(this.step === 0.05) {
            this.initTween(this.objects)
          }
          this.$tweener.update()
          this.renderer.setRenderTarget( null );
          this.renderer.render( this.scene, this.camera );
		},
        init() {
          this.container = document.getElementById( 'container' );
          
          this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
          this.camera.position.x = 300;
          this.camera.position.y = 300;
          this.camera.position.z = 0;
          
          this.scene = new THREE.Scene();
          this.scene.background = new THREE.Color( 0xffffff );
          
          this.pickingScene = new THREE.Scene();
          this.pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
          
          this.scene.add( new THREE.AmbientLight( 0x999999 ) );
          
          const light = new THREE.SpotLight( 0xffffff, 1.5 );
          light.position.set( 500, 0, 2000 );
          this.scene.add( light );
          
        //   const pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
          const defaultMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: true, shininess: 0	} );


          
          this.matrix = new THREE.Matrix4();
          this.quaternion = new THREE.Quaternion();
          this.color = new THREE.Color();



          let data = this.getHotData()
        //   let data = this.getDataTest()
          this.addCube(data)

          this.objects = new THREE.Mesh( BufferGeometryUtils.mergeBufferGeometries( this.geometriesDrawn ), defaultMaterial );
          this.scene.add( this.objects );


        //   this.scene.add( new THREE.Mesh( BufferGeometryUtils.mergeBufferGeometries( this.geometriesPicking ), pickingMaterial ) );
          
          this.highlightBox = new THREE.Mesh(
              new THREE.BoxGeometry(),
              new THREE.MeshLambertMaterial( { color: 0xffff00 }
              ) );
          this.scene.add( this.highlightBox );
          
          this.renderer = new THREE.WebGLRenderer({ antialias: true });
        //   this.renderer.setPixelRatio( window.devicePixelRatio );
          this.renderer.setSize( window.innerWidth, window.innerHeight );
          this.container.appendChild( this.renderer.domElement );
          
          this.controls = new TrackballControls( this.camera, this.renderer.domElement );
          this.controls.rotateSpeed = 1.0;
          this.controls.zoomSpeed = 1.2;
          this.controls.panSpeed = 0.8;
          this.controls.noZoom = false;
          this.controls.noPan = false;
          this.controls.staticMoving = true;
          this.controls.dynamicDampingFactor = 0.3;
          this.stats = new stats();
          this.container.appendChild( this.stats.dom );
        },
        applyVertexColors( geometry, color ) {
          const position = geometry.attributes.position;
          const colors = [];
          for ( let i = 0; i < position.count; i ++ ) {
              colors.push( color.r, color.g, color.b );
          }
          geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        },
        getColor (val) {
           let color = this.colorArray[3]
           let res = parseInt(val / 10) + ''
           switch (res) {
            case '2': color = this.colorArray[0]; break;
            case '3': color = this.colorArray[1]; break;
            case '4': color = this.colorArray[2]; break;
            default: color = this.colorArray[3]; break;
           }
           return color
        },
        getDataTest() {
            let data = [[]]
            for(let i = 0; i < this.testData[0].length; i++) {
                data[0].push(this.createPosition(this.testData[i]))
            }
            return data
        },
        getHotData() {
          let data = [] // 热力点数据
          let floorNum = 1 // 3层楼
          let hotNum = 10
        //   let this.colorArray = ['0xff0000', '0xffff00', '0x00ffff', '0x0000ff']
          for(let floor = 0; floor < floorNum; floor++) {
            data[floor] = []
            for(let i = 0; i < hotNum; i++) {
              let val = {
                x: Math.random() * 20 - 10,
                y: floor * 50,
                z: Math.random() * 80 - 40,
                val: Math.random() * 100 // 20 - 50
              }
              data[floor].push(val)
            }
          }
          return data
        },
        addCube(data) {
           for(let floor = 0; floor < data.length; floor++) {
             for(let i = 0; i < data[floor].length; i++) {
        
               let geometry = new THREE.BoxGeometry(10, data[floor][i].val, 10);
        
               const position = new THREE.Vector3();
               position.x = data[floor][i].x;
               position.y = data[floor][i].y + data[floor][i].val / 2 ;
               position.z = data[floor][i].z;
               
               const rotation = new THREE.Euler();
               rotation.x = 0;
               rotation.y = 0;
               rotation.z = 0;
               
               const scale = new THREE.Vector3();
               scale.x = 1;
               scale.y = 1;
               scale.z = 1;
               this.quaternion.setFromEuler( rotation );
               this.matrix.compose( position, this.quaternion, scale );
               
               geometry.applyMatrix4( this.matrix );
               
               console.log(data[floor][i].val)
               this.applyVertexColors( geometry, this.color.setHex( this.getColor(data[floor][i].val) ) );
        
               this.geometriesDrawn.push( geometry );
               
               geometry = geometry.clone();
               
               // give the geometry's vertices a color corresponding to the "id"
               
               this.applyVertexColors( geometry, this.color.setHex( i ) );
               
               this.geometriesPicking.push( geometry );
               this.pickingData.push({
                  position: position,
                  rotation: rotation,
                  scale: scale
               });
             }
           }
        }
      }
    };
    
    </script>
    
    <style>
    
    body {
    
      margin: 0;
    
      overflow: hidden;
    
      /* 隐藏body窗口区域滚动条 */
    
    }
    
    </style>