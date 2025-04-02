import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import userService from "@/service/userService";
import { useParams, useNavigate } from "react-router-dom";
import authService from "@/service/authService";
import useUser from "@/hooks/useUser";
import InputText from "@/component/InputText";
import updateSchema from "@/schema/updateSchema";
let timer;

function EditProfile() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useUser();
  const userId = user.id;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateSchema),
  });

  // check email
  const emailValue = watch("email");
  useEffect(() => {
    if (!emailValue) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const isValid = await trigger("email");

      if (isValid) {
        const emailCheck = await authService.checkEmailUpdate(
          emailValue,
          userId
        );
        if (emailCheck) {
          setError("email", {
            type: "manual",
            message: "Email này đã được sử dụng",
          });
        }
      }
    }, 400);
  }, [emailValue, trigger, setError]);

  //  check phone
  const phoneValue = watch("phone");
  useEffect(() => {
    if (!phoneValue) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const isValid = await trigger("phone");
      if (isValid) {
        const phoneCheck = await authService.checkPhone(phoneValue);
        if (phoneCheck) {
          setError("phone", {
            type: "manual",
            message: "Phone này đã được sử dụng",
          });
        }
      }
    }, 400);
  }, [phoneValue, trigger, setError]);

  // check username
  const usernameValue = watch("username");
  useEffect(() => {
    if (!usernameValue) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const isValid = await trigger("username");
      if (isValid) {
        const usernameCheck = await authService.CheckUsername(usernameValue);
        if (usernameCheck) {
          setError("username", {
            type: "manual",
            message: "Username này đã được sử dụng",
          });
        }
      }
    }, 400);
  }, [usernameValue, trigger, setError]);

  // setValue form
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.email || "");
      setValue("gender", user.gender || "");
      setValue("phone", user.phone || "");
      setValue("birthDate", user.birthDate || "");
      setValue("username", user.username || "");
      setLoading(false);
    }
  }, [user, setValue]);

  // submit
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await userService.update(username, data);
      alert("Cập nhật thành công!");
      navigate(`/p/${username}`);
    } catch (error) {
      console.log("Lỗi cập nhật:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      alert(
        `Cập nhật thất bại! ${JSON.stringify(
          error.response?.data || error.message
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <span>Họ:</span>
      <InputText
        name="firstName"
        register={register}
        message={errors.firstName?.message}
      ></InputText>

      <span>Tên:</span>
      <InputText
        name="lastName"
        register={register}
        message={errors.lastName?.message}
      ></InputText>

      <span>Username:</span>
      <InputText
        name="username"
        register={register}
        message={errors.username?.message}
      ></InputText>

      <span>Email:</span>
      <InputText
        name="email"
        register={register}
        message={errors.email?.message}
      ></InputText>

      <span>Giới tính:</span>
      <select {...register("gender")}>
        <option value="">Chưa cập nhật</option>
        <option value="male">Nam</option>
        <option value="female">Nữ</option>
      </select>

      <span>Số điện thoại:</span>
      <InputText
        name="phone"
        register={register}
        message={errors.phone?.message}
      ></InputText>

      <span>Ngày sinh:</span>
      <InputText
        type="date"
        name="birthDate"
        register={register}
        message={errors.birthDate?.message}
      ></InputText>

      <button type="submit">{loading ? "Đang lưu..." : "Lưu thay đổi"}</button>
    </form>
  );
}

export default EditProfile;
