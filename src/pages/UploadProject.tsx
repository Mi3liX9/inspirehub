import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { insertProject } from "../utils/uploadProject";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";
import {
  faCircleXmark,
  faCloudArrowUp,
  faPlus,
  faTimesCircle,
  faFileUpload,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
interface TeamMember {
  name: string;
  linkedIn: string;
  twitter: string;
}

const teamMemberVariants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export default function AddProject() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [motivation, setMotivation] = useState("");
  const [budget, setBudget] = useState("");
  const [features, setFeatures] = useState("");
  const [resources, setResources] = useState("");
  const [tools, setTools] = useState("");
  const [others, setOthers] = useState("");
  // const [currency, setCurrency] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", linkedIn: "", twitter: "" },
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user === null || typeof user === "undefined") {
        navigate("/login");
      }
    });

    const interval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple form validation as an example
    if (!title || !description) {
      setSubmitMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitted(false);
    setSubmitMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insert project data into the database
      await insertProject({
        budget,
        title,
        problem: "problem",
        motivation,
        solution: "solution",
        creatorID: user!.id,
        image: file,
        description,
        category,
        tools: tools,
        teamMembers: teamMembers.map((member) => ({
          LinkedIn: member.linkedIn,
          name: member.name,
          Twitter: member.twitter,
          photo: "",
        })),
      });

      // Set submission state and display a success message
      setIsSubmitted(true);
      setSubmitMessage("Your project has been uploaded successfully.");

      // Reset form fields and state after successful upload
      setTitle("");
      setDescription("");
      // navigate("/projects")
      // ...reset other state variables
      navigate("/projects");
    } catch (error: any) {
      // Handle any errors during the upload process
      setSubmitMessage(`An error occurred: ${error.message}`);
    }

    // Remove the submit message after a delay
    setTimeout(() => {
      setSubmitMessage("");
    }, 5000); // Adjust the delay as needed
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", linkedIn: "", twitter: "" }]);
  };

  const handleRemoveTeamMember = (index: number) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImages((prevImages) => {
          // Set selected index to new image
          const newImages = [...prevImages, reader.result as string];
          if (newImages.length === 1) {
            // If it's the first image, ensure that the selectedIndex is updated to show it
            setSelectedIndex(0);
          }
          return newImages;
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (selectedIndex >= images.length - 1) {
      setSelectedIndex(0);
    }

    const inputElement = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("hello");

    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      console.log({ file: event.target.files });

      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleFileDelete = () => {
    setFileName("");
    // Trigger a synthetic event to reset the file input
    const event = new Event("input", { bubbles: true });
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    fileInput.value = "";
    fileInput.dispatchEvent(event);
  };

  const containerVariants = {
    hidden: { x: "100vw", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90 },
    },
  };

  // Variants for Framer Motion animations
  const checkmarkVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="bg-[#f7f7f7] mt-16 px-4 sm:px-10 flex justify-center items-start h-auto min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-[#f7f7f7] my-8 p-10 shadow-2xl rounded-lg max-w-5xl w-full">
        <h1 className="text-[#bfa260] font-nunito font-bold text-2xl md:text-3xl mb-6 text-center">
          Upload Project
        </h1>

        {/* Photo Upload Section */}
        <div className="mb-6">
          <div
            className="relative flex items-center justify-center p-4 mb-4 border border-gray-400 border-dashed rounded image-container"
            style={{ minHeight: "500px" }}
          >
            {images.length > 0 ? (
              <img
                src={images[selectedIndex]}
                alt="Uploaded"
                className="absolute top-0 left-0 object-contain w-full h-full"
              />
            ) : (
              <span className="m-16 text-center font-roboto">
                Click on the upload button to upload and display an image
              </span>
            )}
            {/* Dot indicators */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`inline-block h-4 w-4 mx-1 rounded-full cursor-pointer ${
                    selectedIndex === index ? "bg-[#5F7FBF]" : "bg-white"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                ></span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center p-1 border border-gray-400 rounded"
                style={{ width: "100px", height: "100px" }} // Fixed size container
              >
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="absolute object-cover w-full h-full" // Object-fit to cover the container
                  onClick={() => setSelectedIndex(index)}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 flex items-center justify-center m-auto text-red-700"
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
                </button>
              </div>
            ))}
            <label
              htmlFor="image-upload"
              className="group flex items-center justify-center p-1 bg-[#5f7fbf] border-2 border-[#5f7fbf] rounded cursor-pointer
                        transition-all duration-700 hover:bg-[#3e60a3] hover:border-[#3e60a3] focus:outline-none shadow-md hover:shadow-xl
                        disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              style={{ width: "100px", height: "100px" }}
            >
              <div className="text-center text-[#f7f7f7]">
                <FontAwesomeIcon
                  icon={faCloudArrowUp}
                  size="2xl"
                  className="transition-all duration-700 group-hover:scale-110"
                />
              </div>
            </label>
            <input
              name="imageUpload"
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-[#bfa260] mb-2">Title:</label>
            <input
              name="tilte"
              type="text"
              placeholder="InspireHub"
              className="w-full px-4 py-2 transition-all duration-300 border rounded focus:px-5 focus:outline-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            <div className="flex-1 mr-2">
              <label className="block text-[#bfa260] mb-2">
                Date of project:
              </label>
              <input
                type="date"
                name="date"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="flex-1 ml-2">
              <label className="block text-[#bfa260] mb-2">Category:</label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded h-[40px]"
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          <div className="flex-1 mr-2">
            <label className="block text-[#bfa260] mb-2">Budget:</label>
            <div className="flex">
              <input
                name="budget"
                type="number"
                placeholder="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 px-4 py-2 transition-all duration-300 border rounded rounded-l focus:px-5 focus:outline-0"
              />
              <select className="px-4 py-2 border-t border-b border-r rounded-r outline-0">
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#bfa260] mb-2">Description:</label>
            <textarea
              placeholder="It is a website that is a hub for inspiring and innovative project ideas..."
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-[#bfa260] mb-2 ">Motivation:</label>
            <textarea
              placeholder="The primary motivation behind InspireHub is to address a significant challenge..."
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
            ></textarea>
          </div>

          <label className="block text-[#bfa260] mb-2">Team member:</label>

          <AnimatePresence>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={teamMemberVariants}
                layout
                className="flex items-center mb-2"
              >
                <input
                  name="member"
                  type="text"
                  placeholder="Name"
                  className="flex-1 px-4 py-2 border rounded outline-0"
                  value={member.name}
                  onChange={(e) => {
                    const newTeamMembers = [...teamMembers];
                    newTeamMembers[index].name = e.target.value;
                    setTeamMembers(newTeamMembers);
                  }}
                />
                <input
                  name="linkedIn"
                  type="text"
                  placeholder="LinkedIn"
                  className="flex-1 px-4 py-2 border rounded outline-0"
                  value={member.linkedIn}
                  onChange={(e) => {
                    const newTeamMembers = [...teamMembers];
                    newTeamMembers[index].linkedIn = e.target.value;
                    setTeamMembers(newTeamMembers);
                  }}
                />
                <input
                  name="twitter"
                  type="text"
                  placeholder="Twitter"
                  className="flex-1 px-4 py-2 border rounded outline-0"
                  value={member.twitter}
                  onChange={(e) => {
                    const newTeamMembers = [...teamMembers];
                    newTeamMembers[index].twitter = e.target.value;
                    setTeamMembers(newTeamMembers);
                  }}
                />
                {index === 0 ? (
                  <motion.button
                    type="button"
                    onClick={handleAddTeamMember}
                    className="flex items-center justify-center w-8 h-8 p-2 m-2 text-white bg-[#5f7fbf] rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => handleRemoveTeamMember(index)}
                    className="flex items-center justify-center w-8 h-8 p-2 m-2 text-red-700 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="2xl" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div>
            <label className="block text-[#bfa260] mb-2">Features:</label>
            <textarea
              placeholder="Easy to use, Suitable for everyone ..."
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-[#bfa260] mb-2">Resources:</label>
            <textarea
              placeholder="https://github.com/InspireHub"
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-[#bfa260] mb-2">Tools:</label>
            <textarea
              placeholder="React, Astro ..."
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
            ></textarea>
          </div>

          {/* <div>
            <label className="block text-[#bfa260] mb-2">Document:</label>
            <input type="file" className="px-4 py-2 border rounded" />
          </div> */}

          <div>
            <label className="block text-[#bfa260] mb-2">Document:</label>
            <div className="flex items-center px-4 py-2 text-gray-700 bg-white border rounded cursor-pointer">
              <label
                htmlFor="file-upload"
                className="flex items-center cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className="mr-2 text-[#3e60a3]"
                />
                <span className="text-sm">{fileName || "Choose File"}</span>
              </label>
              {fileName && (
                <button
                  type="button"
                  onClick={handleFileDelete}
                  className="ml-2 text-red-600"
                  title="Remove file"
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              )}
              <input
                name="document"
                type="file"
                className="hidden"
                id="file-upload"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#bfa260] mb-2">Others:</label>
            <textarea
              placeholder="This is the first version, we are working to update it as soon as depending on your suggestions..."
              className="w-full px-4 py-2 transition-all duration-300 border rounded resize-none focus:px-5 focus:outline-0"
              value={others}
              onChange={(e) => setOthers(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col items-center mt-6">
            <button
              type="submit"
              className="bg-[#5f7fbf] text-white px-20 py-3 rounded font-bold align-middle
              transition-all duration-700 hover:bg-[#3e60a3] focus:outline-none shadow-md hover:shadow-xl
          disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Submit
            </button>
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={checkmarkVariants}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center mt-4"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="xl"
                    className="text-green-500"
                  />
                  <motion.span
                    className="mt-2 text-green-600 text-md"
                    variants={checkmarkVariants}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {submitMessage}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
