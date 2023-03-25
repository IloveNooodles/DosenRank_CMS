import { OptionBase } from 'chakra-react-select';
import { Props as ReactSelectProps } from 'chakra-react-select';

export interface University {
  id: number;
  name: string;
  slug: string;
}

export interface Course {
  id: number;
  course_id: number;
  course_name: string;
  institute_id: number;
  institution_name: string;
  slug: string;
}

export interface Professor {
  id: number;
  name: string;
  institutionId: number;
  institutionName: string;
  slug: string;
}

export interface UniversityRowProps extends University {
  action?: VoidFunction;
}

export interface ProfessorRowProps extends Professor {
  action?: VoidFunction;
}

export interface CourseRowProps extends Course {
  action?: VoidFunction;
}

export interface ProfessorsResponse {
  data: Professor[];
}
export interface ProfessorResponse {
  data: Professor;
}
export interface UniversitiesResponse {
  data: University[];
}
export interface UniversityResponse {
  data: University;
}

export interface Response<T> {
  data: T;
}

export interface FormikEditProfessorProps extends Professor {
  newCourse: number;
}

export interface SelectOption extends OptionBase {
  label: string;
  value: string;
}

export interface SelectFieldProps extends ReactSelectProps<SelectOption> {
  name: string;
  label?: string;
  options: Array<SelectOption>;
}
