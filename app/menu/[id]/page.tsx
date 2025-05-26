import { NextPage } from "next";
import MenuDetailModule from ".";
import CustomerLayout from "@/components/customer-layout";

const MenuDetailPage: NextPage<{
    params: { id: string }
}> = ({ params }) => {
    const { id } = params;

    return (
        <CustomerLayout>
            <MenuDetailModule id={id} />
        </CustomerLayout>
    );
}

export default MenuDetailPage;