import React, { useState } from "react";
import axios from "axios";
import "./Main.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [genderPrompt, setGenderPrompt] = useState(""); 
  const [facePrompt, setFacePrompt] = useState(""); 

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage1, setGeneratedImage1] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState(0);                 

  var width = 1;    // 이미지 너비
  var height = 1;  // 이미지 높이



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

  const handleImageChange = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
      if (file) {
        console.log("file is here!!")
        setImage(file); // setImage, File 타입

        const reader = new FileReader();
        console.log(reader);

        reader.onloadend = () => {

          // setWidth, setHeight
          const img = new Image(); 
          img.src = reader.result; 
          img.onload = () => {
            console.log("Image Width:", img.width);  
            console.log("Image Height:", img.height); 
            width = img.width;
            height = img.height;
          };
          setPreview(reader.result); // setPreview

        };
        reader.readAsDataURL(file);
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
        const base64Image1 = reader.result.split(",")[1]; 

  
      // 1. Prepare payload1 : lora, controlnet able

        const prompt1 = `emoji, ${prompt}, <lora:memoji:1>`;
        const scale1 = 1;
        const controlNet1 = "True";

        const payload1 = {
          seed: -1,
          init_images: [base64Image1],
          prompt: prompt1,
          negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
          strength: 0.7,
          steps: 50,
          cfg_scale: 7.0,

          // upscaling
          width: width * scale1, 
          height: height * scale1,
          resize_mode: 0,
          //resize_mode: -1,

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
                  //"processor_res": 512,
                  //"resize_mode": "Crop and Resize",
                  "weight": 1
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
          console.log(response.data);
  
          // 2. Prepare payload2 : lora, controlnet disable, upscaling
          const base64Image2 = response.data.images[0]; 
          const prompt2 = `emoji, ${prompt}`;
          const scale2 = 1.5;
          const controlNet2 = "False";

          const payload2 = {
            seed: -1,
            init_images: [base64Image2],
            prompt: prompt2,
            negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
            strength: 0.7,
            steps: 50,
            cfg_scale: 7.0,

            // upscaling
            width: width * scale2, 
            height: height * scale2,
            resize_mode: 0,
            //resize_mode: -1,

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
                    //"processor_res": 512,
                    //"resize_mode": "Crop and Resize",
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
              setProgress(50 + progressResponse.data.progress * 50); // 두 번째 요청은 50% ~ 100%
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
          console.log("second generated image");
          console.log(response2.data);
        } catch (error) {
          console.error("Error during image generation:", error);
          alert("Failed to generate image. Check console for details.");
        }
      };
      reader.readAsDataURL(image);
    } catch (error) {
    console.error(error);
    alert("Failed to convert image to Base64. Check console for details.");
    } finally {
    }
  };



 
  return (<div style={{ textAlign: "center" }}>
    <h1>Stable Diffusion img2img</h1>
    <form onSubmit={handleSubmit}>

      <div className="category"> Gender : </div>
      <div className="form-group"> {/* gender */}
        {/* <div className="category"> Gender : </div> */}
        
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
        {/* <div className="category">
          Face : 
        </div> */}
        
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
        <label>
          <input
            type="radio"
            value={"Happy"}
            onChange={facePromptHandler}
            checked={facePrompt === "Happy"}
          />
          happy
        </label>
      </div>

      {/*<div className="form-group">
        <label>
          Steps:
        </label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value, 10))}
            min="1"
            max="100"
            required
          />
      </div>*/}
      
      <div className="form-group image-upload">
        <div className="sub-form">
          <div className="sub-form-title">Input Image</div>
            {preview ? (
              <img 
                src={preview}
                alt=""
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
