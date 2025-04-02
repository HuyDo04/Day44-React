import Button from "@/component/Button";
import useUser from "@/hooks/useUser";
import authService from "@/service/authService";
import userService from "@/service/userService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch thông tin profile của user
  useEffect(() => {
    async function handle() {
      try {
        const res = await userService.getOne(username);
        setProfile(res);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
      }
    }
    handle();
  }, [username]);

  // Fetch thông tin user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user hiện tại:", error);
      }
    };
    fetchUser();
  }, []);

  if (!currentUser) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <>
      <h1>User Profile</h1>
      <p>
        Họ và tên: {profile.firstName} {profile.lastName}
      </p>
      <p>Email: {profile.email}</p>
      <p>Giới tính: {profile.gender || "Chưa cập nhật"}</p>
      <p>Tuổi: {profile.age || "Chưa cập nhật"}</p>
      <p>Số điện thoại: {profile.phone || "Chưa cập nhật"}</p>
      <p>Ngày sinh: {profile.birthDate || "Chưa cập nhật"}</p>
      <p>
        Trạng thái:
        {profile.emailVerifiedAt
          ? "Tài khoản đã được xác minh"
          : "Tài khoản chưa xác minh"}
      </p>
      {profile.username === currentUser.username && (
        <button onClick={() => navigate(`/profile/${profile.username}/edit`)}>
          Chỉnh sửa
        </button>
      )}
    </>
  );
}

export default Profile;
