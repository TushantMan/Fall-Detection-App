import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function SignInwithGoogle() {
  const navigate = useNavigate();

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        navigate("/dashboard"); // Changed from "/profile" to "/dashboard"
      }
    }).catch((error) => {
      toast.error(error.message, {
        position: "bottom-center",
      });
    });
  }

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../google.png")} width={"80%"} alt="" />
      </div>
    </div>
  );
}

export default SignInwithGoogle;