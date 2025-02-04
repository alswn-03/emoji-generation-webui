# 😀 MY MEMOJI
# | Introduction <br>
**My Memoji**는 **유저 사진을 input으로 그와 닮은 memoji를 생성해주는 서비스**입니다. <br>
SDXL을 finetuning하고, 독립적인 ldm을 사용하여 post-hoc img2img 성능을 개선하였습니다. 더하여, React를 사용해 custom ui를 빌드하였습니다.<br>
📄 [Visit our notion for more detail!](https://sparkly-onion-be7.notion.site/My-Memoji-16f8e2ec5d7a81cea547f92474f83cd0?pvs=4)
<br><br>
**🔥 Motivation 🔥**<br>
미모지는 사용자가 자신을 닮은 맞춤형 캐릭터를 만들 수 있도록 도와주는 Apple의 앱입니다.
하지만, 미모지를 만들 때 지정할 수 있는 스타일에 한계가 있기에 나와 닮게 만들기 힘들다는 문제점이 있습니다.<br>
저희는 이러한 문제점을 바탕으로, 사진을 찍으면 나와 닮은 미모지를 자동으로 생성해주는 프로젝트를 진행해보기로 하였습니다.


# | How to use <br>
### 1. stablediffusion 모델 다운로드 및 실행
   - [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) <br>
      위 링크를 따라 AUTOMATIC1111 WebUI을 다운로드합니다.<br>
      AUTOMATIC1111 WebUI는 StableDiffusion 이미지 생성에 쓰이는 WebUI 입니다. **MyMemoji**의 UI는 위의 github 링크의 UI에서 제공하는 api를 활용하여 작성되었습니다. <br>
   
   -  .safetensors 다운로드 <br>
      이모지 생성을 위해 튜닝한 모델의 checkpoint를 다운로드합니다. 가중치와 바이어스 수치가 저장되어 있으며 **.safetensors**가 확장자인 파일 뭉치로 구성되어 있습니다.

      다운로드한 모델 파일(" .safetensors")은 Models > StableDiffusion 폴더에 위치해야합니다.
      ```
      └──...── Models/           
      │        └── StableDiffusion/        
      │            ├── Put Stable Diffusion checkpoints here.txt
      |            ├── 모델 파일 (" .safetensors")
      |            └── ...  
      │
      ```
   - AUTOMATIC1111 WebUI를 실행한 다음, WebUI 화면에서 Stable Diffusion checkpoint를 " .safetensors" 로 선택합니다.<br>


### 2. Runs the App.js
      `npm start` 
   <br>
      
### 3. 웹사이트 사용 방법
   <img src='./assets/architecture.jpg' width=800><br>
   이모지 생성을 원하는 사진을 넣습니다 <br> 
   -> 성별과 얼굴 표정 선택합니다 <br> 
   -> **Generate** 를 누릅니다. 
   <br><br>
    
# | Model
<img src='./assets/architecture.jpg' width=800><br>
➡️ [Download model checkpoint here](https://drive.google.com/drive/folders/10c-bRDNM-EAHATRaCPTQ3ZGfspJUgASs)<br>
- checkpoint for finetuned Samaritan SDXL : `./Lora/memoji-07.safetensors`<br>
- checkpoint for additional ldm : `./Stable-diffusion/samaritan3dCartoon_v40SDXL.safetensors`<br><br>

### 1. base model : <br>
- [Samaritan-3d-Cartoon-SDXL](https://huggingface.co/imagepipeline/Samaritan-3d-Cartoon-SDXL)
- 최대한 프로젝트 목적에 맞는, cartoon 화풍을 가진 모델로 선정함 <br>
<img src='./assets/vanilla samaritan.jpg' width=500><br><br>
  
### 2. 원하는 그림체 만들기 (LoRA finetuning)<br>
- vanilla Samaritan SDXL은 cartoon 화풍을 보여주긴 했지만, 우리가 원하는 emoji 화풍과는 거리가 있었음
- 총 2748개의 preprocessed data를 사용해 LoRA finetuning 진행<br>
<img src='./assets/lora finetuning.jpg' width=500><br>
- 🚨 원하는 스타일이 적용되긴 했지만, 원본 이미지 속 인물과 표정과 자세가 일치하지 않는다는 문제점 발견<br><br>


### 3. 원본 이미지에 충실하기 (ControlNet w/ Canny Edge)<br>
- 2에서 생긴 문제점을 해결하기 위해서 입력 이미지의  edge 정보를 활용하기로 결정함
- Controlnet w/ canny edge를 활용하여 입력 이미지의 edge 정보를 반영한 생성<br>
<img src='./assets/controlnet.jpg' width=500><br>
- 🚨 원본 이미지 속 인물의 윤곽을 잘못 인식하여 생성 이미지에 unwanted artifacts가 나타남
    - 위 예시의 경우, 사진 속 인물의 쌍꺼풀과 애굣살까지 눈으로 인식해버림<br><br>


### 4. 더 부드러운 결과물 얻기<br>
- 3에서 생긴 문제점을 해결하기 위해서, 독립적인 ldm을 추가로 사용함
- 추가 ldm의 역할 :  
    - 3에서의 artifact를 덮어버림  
    - upscaling을 통한 이미지 해상도 향상  
- empirical한 이유로, 추가 ldm은 vanilla 모델을 사용함<br>
<img src='./assets/additional ldm.jpg' width=500><br>
- ✅ 원본 이미지의 윤곽을 반영하면서, 원하는 화풍이 적용된 이미지 생성 성공 !  <br><br>





### | Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

##### Available Scripts

In the project directory, you can run:

##### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

##### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

##### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

##### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

##### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

##### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

##### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

##### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

##### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

##### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
