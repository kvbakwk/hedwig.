import getUser from "@app/api/getUser";
import Back from "@components/Back";
import FormChangePassword from "@components/dashboard/zmiana-hasla/FormChangePassword";

export default async function PasswordPage() {
  const user = await getUser();

  return (
    <div className="relative w-[full] h-auto md:px-[15px]">
      <div className="z-50 fixed top-[10px] flex items-center gap-[25px] text-primary text-[22px] w-[720px] h-[70px] pl-[25px] bg-surface rounded-2xl shadow-lg">
        <Back />
        <span className="text-on-surface">zmiana hasła</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-[20px] w-full md:pt-[90px] sm:pt-[80px] pt-[70px] md:pb-[50px] pb-[100px] md:px-[5px]">
        <FormChangePassword user={user} />
      </div>
    </div>
  );
}
