import React from "react";
import { AccordionSection, TableComponent } from "../components/AboutUs";

const AboutUs: React.FC = () => (
  <div className="bg-[#f7f7f7] mt-16 pl-[60px] pr-[20px] flex justify-center items-start min-h-screen">
    <div className="flex flex-col flex-1 pr-8 space-y-6">
      <h1 className="text-[#bfa260] font-roboto font-bold text-3xl mb-4 text-center">
        About Us
      </h1>

      <AccordionSection title="Inspirehub: A Journey of Passion and Innovation">
        <p className="font-normal text-black font-roboto">
          We are a team of dreamers, innovators, and educators united by a
          common passion: to empower and inspire the next generation of creative
          minds. Our journey began with a simple yet powerful idea – to create a
          space where creativity knows no bounds and every project tells a
          story.
        </p>
      </AccordionSection>

      <AccordionSection title="Our Inspiration">
        <p className="font-normal text-black font-roboto">
          Each member of our team has walked the path of discovery, facing
          challenges and embracing opportunities. We've experienced firsthand
          the power of collaboration and the impact of sharing knowledge. That's
          why we built Inspirehub – a platform not just for showcasing projects,
          but for building the innovators of tomorrow.
        </p>
      </AccordionSection>

      <AccordionSection title="Our Commitment">
        <p className="font-normal text-black font-roboto">
          At Inspirehub, we are committed to fostering a nurturing environment.
          We believe in the power of feedback, the importance of community, and
          the potential of every idea. Our mission goes beyond providing a
          platform; it's about creating a movement of inspired and confident
          creators.
        </p>
      </AccordionSection>

      <AccordionSection title="Our Values">
        <p className="font-normal text-black font-roboto">
          Empathy and Support: We understand the journey of innovation and
          strive to offer the support and guidance needed to navigate it.
          <br />
          Continuous Learning: We are always learning – from each other, from
          our users, and from the ever-evolving world of technology and
          creativity. <br />
          Inclusivity and Diversity: Our strength lies in our diversity. We
          celebrate and embrace diverse perspectives, believing they lead to
          richer experiences and more innovative solutions.
        </p>
      </AccordionSection>

      <AccordionSection title="Join Our Story">
        <p className="font-normal text-black font-roboto">
          Every member of our community, every user who shares a project, and
          every feedback given adds a page to the Inspirehub story. We invite
          you to be a part of this journey. Share your projects, your ideas, and
          your vision with us, and let's inspire a world of creativity together.
        </p>
      </AccordionSection>

      <hr />

      <div className="flex items-center justify-center">
        <TableComponent />
      </div>
    </div>
  </div>
);

export default AboutUs;
