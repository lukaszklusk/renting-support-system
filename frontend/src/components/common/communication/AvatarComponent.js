import React, { useRef, useEffect, useState } from "react";
import Avatar from "avatar-initials";
import { Avatar as AvatarUI } from "@chatscope/chat-ui-kit-react";
import { Conversation } from "@chatscope/chat-ui-kit-react";

const AvatarComponent = () => {
  const canvasRef = useRef();
  const [avatarBase64, setAvatarBase64] = useState("");

  useEffect(() => {
    const avatar = new Avatar({
      initials: "AB",
      bgColor: "#3498db",
      textColor: "#ffffff",
      size: 100,
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = avatar.bgColor;
    ctx.fillRect(0, 0, 100, 100);

    ctx.font = "bold 40px Arial";
    ctx.fillStyle = avatar.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(avatar.initials, 50, 50);

    const url = canvas.toDataURL("image/png");

    console.log("url:", url);
    setAvatarBase64(url);
  }, []);

  return (
    <div>
      <Conversation
        name="Lilly"
        lastSenderName="Lilly"
        info="Yes i can do it for you"
      >
        <AvatarUI src={avatarBase64} name="Lilly" />
      </Conversation>
      {/* <canvas
        ref={canvasRef}
        width={100}
        height={100}
        style={{ display: "none" }}
      /> */}
      {/* <img src={avatarBase64} alt="Avatar" /> */}
    </div>
  );
};

export default AvatarComponent;
