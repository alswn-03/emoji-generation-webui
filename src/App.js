import React, { useState } from "react";
import axios from "axios";
import "./Main.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [genderPrompt, setGenderPrompt] = useState(""); 
  const [facePrompt, setFacePrompt] = useState(""); 
  const [hasGlasses, setHasGlasses] = useState(false); // glasses 상태 추가

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage1, setGeneratedImage1] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);                 

  const [width, setWidth] = useState(1);    // 이미지 너비
  const [height, setHeight] = useState(1);   // 이미지 높이

  const [email, setEmail] = useState("");
  

{/* 
  const genderPromptHandler = (e) => {
    setGenderPrompt(e.target.value);
    setPrompt(e.target.value + ", " + facePrompt);
    console.log("prompt : ", prompt);
  };

  const facePromptHandler = (e) => {
    setFacePrompt(e.target.value);
    setPrompt(genderPrompt + ", " + e.target.value);
    console.log("prompt : ", prompt);
  };
*/}


  // 성별 선택 핸들러
  const genderPromptHandler = (e) => {
    const newGender = e.target.value;
    setGenderPrompt(newGender);
    setPrompt(`${newGender}, ${facePrompt}${hasGlasses ? ", glasses" : ""}`);
  };

  // 얼굴 표정 선택 핸들러
  const facePromptHandler = (e) => {
    const newFace = e.target.value;
    setFacePrompt(newFace);
    setPrompt(`${genderPrompt}, ${newFace}${hasGlasses ? ", glasses" : ""}`);
  };

  // glasses 버튼 클릭 핸들러
  const toggleGlasses = () => {
    setHasGlasses((prev) => {
      const newHasGlasses = !prev;
      setPrompt(`${genderPrompt}, ${facePrompt}${newHasGlasses ? ", glasses" : ""}`);
      return newHasGlasses;
    });
  };


  const handleImageChange = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
      if (file) {
        console.log("file is here!!")

        // setImage
        setImage(file); 

        const reader = new FileReader();
        reader.onloadend = () => {

          // setWidth, setHeight
          const img = new Image(); 
          img.src = reader.result; 
          img.onload = () => {
            console.log("Image Width:", img.width);  
            console.log("Image Height:", img.height); 
            setWidth(img.width);
            setHeight(img.height);
          };

          // setPreview
          setPreview(reader.result); 

        };
        reader.readAsDataURL(file);
    }
  };

  const sendEmail = async (base64Image) => {
    if (!email) return;

    try {
      console.log("Image sent to " + email)
      await axios.post("http://127.0.0.1:3001/api/send-email", { //http://127.0.0.1:3001
        to: email,
        subject: "Generated Memoji",
        image: base64Image
      });
      alert("Image sent to " + email);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !prompt) {
      alert("Please upload an image and enter a prompt.");
      return;
    } 
    setLoading(true);
    setProgress(0);  // progress 상태 초기화

    try {
      // Convert image file to Base64
      const reader = new FileReader();
      reader.onload = async () => {

         // 1. Prepare payload1 : lora, controlnet able
        const base64Image1 = reader.result.split(",")[1]; 
        const prompt1 = `emoji, ${prompt}, <lora:memoji:1>`;
        const controlNet1 = "True";
        const width1 = width;
        const height1 = height;

      let interval1;

      try {
        // 첫 번째 진행률 추적
        interval1 = setInterval(async () => {
          try {
            const progressResponse = await axios.get("/sdapi/v1/progress");
            setProgress(progressResponse.data.progress * 50);
          } catch (error) {
            console.error("Error fetching progress:", error);
          }
        }, 1000);

        clearInterval(interval1);
        
        const response1 = await axios.post("/sdapi/v1/img2img", payload1, {
          headers: { "Content-Type": "application/json" },
        });

        setGeneratedImage(response1.data.images[0]);

        // 두 번째 이미지 생성을 위한 데이터 준비
        const base64Image2 = response1.data.images[0]; 
        const prompt2 = `emoji, ${prompt}`;
        const controlNet2 = "False";
        const width2 = Math.round(width * 1.5);
        const height2 = Math.round(height * 1.5);

        const payload2 = {
          seed: 2968506678,
          init_images: [base64Image1],
          prompt: prompt1,
          negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
          strength: 0.3, //0.7
          steps: 50,
          cfg_scale: 7.0,

          // upscaling
          width: width1, 
          height: height1,
          resize_mode: 0,

          sampler_name: "DDIM",
          //"override_settings" : {
          //    "sd_model_checkpoint": "samaritan3dCartoon_v40SDXL.safetensors [1b8fca3fee]",
          //},

          // controlnet
          alwayson_scripts: { 
            "ControlNet": { 
              "args": [
                {
                  "enabled": controlNet1,
                  "guidance_end": 1,
                  "guidance_start": 0,
                  "model": "diffusers_xl_canny_full [2b69fca4]",
                  "module": "canny",
                  "pixel_perfect": "True",
                  "weight": 1,

                  "threshold_a": 70,   // low
                  "threshold_b": 230    // high
                }
              ]
            }
          }
        };
        console.log("payload1")
        console.log(payload1);

        // progress 1
        const interval1 = setInterval(async () => {
          try {
            const progressResponse = await axios.get("/sdapi/v1/progress");
            setProgress(progressResponse.data.progress * 50); // 첫 번째 요청은 0% ~ 50%
          } catch (error) {
            console.error("Error fetching progress:", error);
          }
        }, 1000);


        try { 
          // post 1
          const response = await axios.post("/sdapi/v1/img2img", payload1, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          clearInterval(interval1); // 첫 번째 요청 완료 시 interval 종료
          setGeneratedImage1(response.data.images[0]);
          console.log("first generated image");
  
          // 2. Prepare payload2 : lora, controlnet disable, upscaling
          const base64Image2 = response.data.images[0]; 
          const prompt2 =  `emoji, ${prompt}, <lora:memoji:1>`;//`emoji, ${prompt}`;
          const controlNet2 = "False";
          const width2 = Math.round(width * 1.5);
          const height2 = Math.round(height * 1.5);

          const payload2 = {
            seed: 2968506678,
            init_images: [base64Image2],
            prompt: prompt2,
            negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
            strength: 0.3, //0.7
            steps: 50,
            cfg_scale: 7.0,

            // upscaling
            width: width2, 
            height: height2,
            resize_mode: 0,

            sampler_name: "DDIM",
            //"override_settings" : {
            //    "sd_model_checkpoint": "samaritan3dCartoon_v40SDXL.safetensors [1b8fca3fee]",
            //},

            // controlnet
            alwayson_scripts: { 
              "ControlNet": { 
                "args": [
                  {
                    "enabled": controlNet2,
                    "guidance_end": 1,
                    "guidance_start": 0,
                    "model": "diffusers_xl_canny_full [2b69fca4]",
                    "module": "canny",
                    "pixel_perfect": "True",
                    "weight": 1
                  }
                ]
              }
            }
          };
          console.log("payload2")
          console.log(payload2);

          // progress 2
          const interval2 = setInterval(async () => {
            try {
              const progressResponse = await axios.get("/sdapi/v1/progress");
              setProgress(progressResponse.data.progress * 50 + 50); // 두 번째 요청은 50% ~ 100%
            } catch (error) {
              console.error("Error fetching progress:", error);
            }
          }, 1000);

          // post 2
          const response2 = await axios.post("/sdapi/v1/img2img", payload2, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          clearInterval(interval2);
          setGeneratedImage(response2.data.images[0]);
          setProgress(100);

          sendEmail(response2.data.images[0]);
          
          console.log("second generated image");

        } catch (error) {
          console.error("Error during image generation:", error);
          alert("Failed to generate image. Check console for details.");
        }
      };
      reader.readAsDataURL(image);
    } catch (error) {
    console.error(error);
    alert("Failed to convert image to Base64. Check console for details.");
    }
  };



 
  return (<div style={{ textAlign: "center" }}>
    <h1>😀 My Memoji 😀</h1>
    <form onSubmit={handleSubmit}>

      <div className="category"> Gender : </div>
      <div className="form-group"> {/* gender */}        
        <label>
          <input
            type="radio"
            value={"male"}
            onChange={genderPromptHandler}
            checked={genderPrompt === "male"}
          />
          male
        </label>
        <label>
          <input
            type="radio"
            value={"female"}
            onChange={genderPromptHandler}
            checked={genderPrompt === "female"}
          />
          female
        </label>
      </div>
      <div className="category"> Face : </div>
      <div className="form-group "> {/* Face */}
        <label>
          <input
            type="radio"
            value={"smiling face"}
            onChange={facePromptHandler}
            checked={facePrompt === "smiling face"}
          />
          smiling
        </label>
        <label>
          <input
            type="radio"
            value={"crying face"}
            onChange={facePromptHandler}
            checked={facePrompt === "crying face"}
          />
          crying
        </label>
        <label>
          <input
            type="radio"
            value={"Neutral face"}
            onChange={facePromptHandler}
            checked={facePrompt === "Neutral face"}
          />
          neutral
        </label>
        <label>
          <input
            type="radio"
            value={"Angry face"}
            onChange={facePromptHandler}
            checked={facePrompt === "Angry face"}
          />
          angry
        </label>
        <label>
          <input
            type="radio"
            value={"Laughing face"}
            onChange={facePromptHandler}
            checked={facePrompt === "Laughing face"}
          />
          laughing
        </label>
        <label>
          <input
            type="radio"
            value={"Sad face"}
            onChange={facePromptHandler}
            checked={facePrompt === "Sad face"}
          />
          sad
        </label>
        {/*<label>
          <input
            type="radio"
            value={"Happy"}
            onChange={facePromptHandler}
            checked={facePrompt === "Happy"}
          />
          happy
        </label>*/}
        
          {/* Glasses 버튼 (라디오 버튼 스타일) */}
        <label style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "60px",
          height: "30px",
          borderRadius: "15px",
          border: `2px solid ${hasGlasses ? "black" : "#ccc"}`,
          backgroundColor: hasGlasses ? "black" : "white",
          color: hasGlasses ? "white" : "black",
          cursor: "pointer",
          textAlign: "center"
        }}>
          <input type="checkbox" checked={hasGlasses} onChange={toggleGlasses} style={{ display: "none" }} />
          Glasses
        </label>
      </div>
      


      <div className="category"> Email (optional): </div>
      <div className="form-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{ width: "400px" }} // 인라인 스타일로 너비 조절
        />
      </div>
      
      <div className="form-group image-upload">
        <div className="sub-form">
          <div className="sub-form-title">Input Image</div>
            {preview ? (
              <img 
                src={preview}
                alt="Preview"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            ) : (
              <div className="noimg"></div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

        </div>
        <div className="sub-form">
          <div className="sub-form-title" >Generated Image</div>
          {generatedImage && (
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt=""
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
      <button type="submit"> GENERATE !</button>
      {loading && (
        <label style={{ marginTop: "20px", width: "300px" }}>
          <div>Progress: {Math.round(progress)}%</div>
          <progress value={progress} max="100" style={{ width: "100%" }} />
        </label>
      )}
      
    </form>

  </div>
  );
}

export default App;
