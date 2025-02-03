# MY MEMOJI
나만의 **emoji** 를 만들어주는 memoji <br>
이미지 생성 모델 Stablediffusion을 파인튜닝하여 구현되었습니다.



### | How to use
##### 1. stablediffusion 모델 다운로드 및 실행


   - [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 설치 <br>
      StableDiffusion 이미지 생성에 쓰이는 WebUI 입니다. **memoji*의 UI는 위의 github 링크의 UI에서 제공하는 api를 활용하여 작성되었습니다. <br>
      따라서 먼저 위의 링크를 따라 AUTOMATIC1111을 설치한 후, 아래의 순서를 따라가시면 됩니다.
   
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
   - AUTOMATIC1111 WebUI를 실행한 다음, WebUI 화면에서 Stable Diffusion checkpoint를 " .safetensors" 로 선택합니다.


  
##### 2. Runs the App

      `npm start`
   
##### 3. 웹사이트 사용 방법
   
   이모지 생성을 원하는 사진을 넣습니다 <br> -> 성별과 얼굴 표정 선택합니다 <br> -> **Generate** 누릅니다.

   
##### 4. 페이로드에 들어가는 변수 및 설정값
  - 업스케일링
  - 스탭
  - 컨트롤넷
  - 등등
    


### | Model
(모델 설명이 들어갈 예정)












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
