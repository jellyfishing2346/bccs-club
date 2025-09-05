import HeroSection from "../../ui/portal/course-resources/HeroSection";
import MajorSection from "../../ui/portal/course-resources/MajorSection";
import MinorSection from "../../ui/portal/course-resources/MinorSection";
import Prerequisites from "../../ui/portal/course-resources/Prerequisites";
import CoreClasses from "../../ui/portal/course-resources/CoreClasses"
import CourseRecommendations from "../../ui/portal/course-resources/CourseRecommendations";
import Electives from "../../ui/portal/course-resources/Electives";
import Tutoring from "../../ui/portal/course-resources/Tutoring";
import Tips from "../../ui/portal/course-resources/Tips";

export default function Page() {
  return (
    <main>
        <HeroSection />
        <MajorSection />
        <MinorSection />
        <Prerequisites />
        <CoreClasses />
        <CourseRecommendations />
        <Electives />
        <Tutoring />
        <Tips />
    </main>
  );
}