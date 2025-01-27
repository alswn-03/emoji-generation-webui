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
  const [loading, setLoading] = useState(false);

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

    try {
      // Convert image file to Base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image1 = reader.result.split(",")[1]; // base64Image

  
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
          resize_mode: -1,

          // controlnet
          alwayson_scri: { "ControlNet": { "args": [
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

        try { // try 1
          const response = await axios.post("/sdapi/v1/img2img", payload1, {
            headers: {
              "Content-Type": "application/json",
            },
          });
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
            resize_mode: -1,

            // controlnet
            alwayson_scri: { "ControlNet": { "args": [
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

          //try 2
          const response2 = await axios.post("/sdapi/v1/img2img", payload2, {
            headers: {
              "Content-Type": "application/json",
            },
          });
  
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
    setLoading(false);
    }
  };



 
  return (<div style={{ textAlign: "center", padding: "20px" }}>
    <h1>Stable Diffusion img2img</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>
          Gender : 
          </label>
        
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
      <div className="form-group">
        <label>
          Face : 
          </label>
        
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
          <div>Input Image</div>
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
          <div>Generated Image</div>
          {loading && <div>Loading...</div>}
          {generatedImage && (
            <img
              src={`data:image/png;base64,${generatedImage}`}
              alt=""
              style={{ maxWidth: "100%", marginTop: "10px" }}
            />
          )}
        </div>
      </div>
      <button type="submit" disabled={loading}> GENERATE !</button>
    </form>

  </div>
  );
}

export default App;
