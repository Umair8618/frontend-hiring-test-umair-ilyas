"use client";

import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/queries";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { setToken } from "@/lib/auth";

export default function LoginForm() {
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const { data } = await login({ variables: { input: values } });
      setToken(data.login.access_token);
      router.push("/calls");
    } catch (error) {
      console.error("Login failed", error);
      message.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <Form layout="vertical" onFinish={onFinish} className="font-avenir">
            <Form.Item
              label={<span className="avenir-black">User Name</span>}
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                placeholder="username"
                className="avenir-book"
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              label={<span className="avenir-black">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Password"
                className="avenir-book"
                prefix={<LockOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item className="w-[100px] rounded-[1px]">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full avenir-black rounded-[1px]"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
