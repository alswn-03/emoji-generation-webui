import React, { useState } from "react";
import axios from "axios";
import "./Main.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [genderPrompt, setGenderPrompt] = useState(""); 
  const [facePrompt, setFacePrompt] = useState(""); 
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);                 
  const [isGenerating, setIsGenerating] = useState(false);
  const [width, setWidth] = useState(1);    // 이미지 너비
  const [height, setHeight] = useState(1);   // 이미지 높이
  const [email, setEmail] = useState("");

  const genderPromptHandler = (e) => {
    setGenderPrompt(e.target.value);
    setPrompt(e.target.value + ", " + facePrompt);
  };

  const facePromptHandler = (e) => {
    setFacePrompt(e.target.value);
    setPrompt(genderPrompt + ", " + e.target.value);
  };
  // 이미지 업로드 시 호출되는 핸들러
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
    console.log("file is here!!");
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
        // 리사이즈를 위한 canvas 생성
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 리사이즈할 크기 설정
        const targetWidth = 600;
        const targetHeight = 800;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // 원본 이미지를 canvas에 그리기
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // 리사이즈된 이미지 데이터를 가져오기
        const resizedImageData = canvas.toDataURL("image/jpeg");
        
        setPreview(resizedImageData); // 리사이즈된 이미지 미리보기 설정
        // 새로운 리사이즈된 크기로 너비와 높이 설정
        setWidth(targetWidth);
        setHeight(targetHeight);
        
        // 필요에 따라 리사이즈된 이미지를 파일로 변환하기
        canvas.toBlob((blob) => {
            if (blob) {
            setImage(new File([blob], file.name, { type: "image/jpeg" }));
            }
        }, "image/jpeg");
        };
    };
    reader.readAsDataURL(file);
    }
};

  const sendEmail = async (base64Image) => {
    if (!email) return;

    try {
      console.log(email, base64Image)
      await axios.post("http://127.0.0.1:3001/api/send-email", {
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
    if (!image || !prompt || isGenerating) {
      alert("Please upload an image and enter a prompt.");
      return;
    }
    setIsGenerating(true);
    setLoading(true);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image1 = reader.result.split(",")[1];  
      const prompt1 = `emoji, ${prompt}, <lora:memoji:1>`;  
      const controlNet1 = "True";
      const width1 = width;
      const height1 = height;  

      const payload1 = {
        seed: 2968506678,
        init_images: [base64Image1],
        prompt: prompt1,
        negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
        strength: 0.7,
        steps: 50,
        cfg_scale: 7.0,
        width: width1, 
        height: height1,
        resize_mode: 0,
        sampler_name: "DDIM",
        alwayson_scripts: { 
          "ControlNet": { 
            "args": [
              {
                "enabled": controlNet1,
                "guidance_end": 1,
                "guidance_start": 0,
                "model": "diffusers_xl_canny_mid [112a778d]",
                "module": "canny",
                "pixel_perfect": "True",
                "weight": 1
              }
            ]
          }
        }
      };
      

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
          init_images: [base64Image2],
          prompt: prompt2,
          negative_prompt: "Pixelated design, distorted facial features, blurry rendering, overly detailed skin texture, animal-like characteristics, sharp or harsh expressions, low-quality resolution, unrecognizable face, unnatural colors, 3D effects",
          strength: 0.7,
          steps: 60,
          cfg_scale: 7.0,
          width: width2, 
          height: height2,
          resize_mode: 0,
          sampler_name: "DDIM",
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

        let interval2;
        // 두 번째 진행률 추적
        interval2 = setInterval(async () => {
          try {
            const progressResponse = await axios.get("/sdapi/v1/progress");
            setProgress(progressResponse.data.progress * 50 + 50);
          } catch (error) {
            console.error("Error fetching progress:", error);
          }
        }, 1000);

        // 두 번째 이미지 생성 요청
        const response2 = await axios.post("/sdapi/v1/img2img", payload2, {
          headers: { "Content-Type": "application/json" },
        });
        clearInterval(interval2); // 진행률 추적 중지
        setGeneratedImage(response2.data.images[0]);
        setProgress(100);

        sendEmail(response2.data.images[0]);
        
      } catch (error) {
        console.error("Error during image generation:", error);
        alert("Failed to generate image.");
      } finally {
        setIsGenerating(false);
        setLoading(false);
      }
    };
    reader.readAsDataURL(image);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>😀 My Memoji 😀</h1>
      <form onSubmit={handleSubmit}>
        <div className="category"> Gender : </div>
        <div className="form-group">
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
        <div className="form-group">
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
          {/* 얼굴 관련 라디오 버튼 추가 */}
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
            <div className="sub-form-title">Generated Image</div>
            {generatedImage && (
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt=""
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )}
          </div>
        </div>
        <button type="submit" disabled={isGenerating}> GENERATE !</button>
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