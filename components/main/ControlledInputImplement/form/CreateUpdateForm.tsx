"use client";
import ControlledInput from "@/components/shared/input/ControlledInput";
import ControlledMultiSelectField from "@/components/shared/input/ControlledMultiSelectField";
import ControlledSelectField from "@/components/shared/input/ControlledSelectField";
import FileUploadControllerDrag from "@/components/shared/input/FileUploadControllerDrag";
import BaseModal from "@/components/shared/Modal/BaseModal";
import FormActionButtons from "@/components/shared/Modal/FormActionButtons";
import { FormProvider, useForm } from "react-hook-form";

type TPageProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues ?: any 
};

// Define form type
type TUserForm = {
  name: string;
  fName : string;
  lName : string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Pending";
  salary: number;
  projects: string[];
  avatar: File | null;
  joinDate: string;
};

export default function CreateUpdateForm({ isOpen, onClose , initialValues  }: TPageProps) {
  // Form setup
  const methods = useForm<TUserForm>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      status: "Active",
      salary: 0,
      projects: [],
      avatar: null,
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TUserForm) => {
    console.log("form submitted");
    console.log(data);
  };

  // Options for selects
  // const roleOptions = [
  //   { label: "Frontend Developer", value: "Frontend Developer" },
  //   { label: "Backend Developer", value: "Backend Developer" },
  //   { label: "Full Stack Developer", value: "Full Stack Developer" },
  //   { label: "DevOps Engineer", value: "DevOps Engineer" },
  //   { label: "Product Manager", value: "Product Manager" },
  //   { label: "UI/UX Designer", value: "UI/UX Designer" },
  //   { label: "Data Analyst", value: "Data Analyst" },
  //   { label: "QA Engineer", value: "QA Engineer" },
  //   { label: "CTO", value: "CTO" },
  //   { label: "HR Manager", value: "HR Manager" },
  // ];

  const departmentOptions = [
    { label: "Engineering", value: "Engineering" },
    { label: "Product", value: "Product" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "Human Resources", value: "Human Resources" },
    { label: "Finance", value: "Finance" },
    { label: "Executive", value: "Executive" },
  ];

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
    { label: "Pending", value: "Pending" },
  ];

  const projectOptions = [
    { label: "Project A", value: "Project A" },
    { label: "Project B", value: "Project B" },
    { label: "Project C", value: "Project C" },
    { label: "Project D", value: "Project D" },
    { label: "Project E", value: "Project E" },
    { label: "Project X", value: "Project X" },
    { label: "Project Y", value: "Project Y" },
    { label: "Project Z", value: "Project Z" },
    { label: "HR Initiatives", value: "HR Initiatives" },
  ];

  return (
    
 <BaseModal
        className="  max-w-[901px] min-w-[800px] "
        open={isOpen}
        onClose={onClose}
        title={
          initialValues
            ? "Update  Building Information"
            : "Add Building Information"
        }
      >
           {/*  */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FileUploadController name="avatar" className="h-48" /> */}

            <FileUploadControllerDrag name="avatar" label="Employee Photo" />

            <ControlledInput
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              isRequired
            />
            <ControlledInput
              name="fName"
              label="First Name"
              placeholder="Enter first name"
              isRequired
            />
            <ControlledInput
              name="lName"
              label="Last Name"
              placeholder="Enter last name"
              isRequired
            />

            <ControlledInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              isRequired
            />

            <ControlledSelectField
              name="role"
              label="Job Role"
              // options={roleOptions }
              options={[]}
              placeholder="Select job role"
              isRequired
            />

            <ControlledSelectField
              name="department"
              label="Department"
              options={departmentOptions}
              placeholder="Select department"
              isRequired
            />

            <ControlledSelectField
              name="status"
              label="Employment Status"
              options={statusOptions}
              placeholder="Select status"
              isRequired
            />

            <ControlledInput
              name="salary"
              label="Annual Salary ($)"
              type="number"
              placeholder="Enter annual salary"
              isRequired
            />

            <ControlledMultiSelectField
              name="projects"
              label="Assigned Projects"
              // options={projectOptions}
              options={[]}
              placeholder="Select projects"
              isRequired
            />

            <ControlledInput
              name="joinDate"
              label="Join Date"
              type="date"
              isRequired
            />


                 <FormActionButtons
        // isEditMode={isEditMode}
        // isPending={isPending}
        editText="Update Building Info"
        createText="Add Building Info"
      />

            
          </form>
        </FormProvider>
        {/*  */}
       
      </BaseModal>




     





  );
}
