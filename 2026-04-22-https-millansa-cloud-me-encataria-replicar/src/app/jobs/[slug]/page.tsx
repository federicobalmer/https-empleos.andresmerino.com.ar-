import { redirect } from "next/navigation";

type Props = {
  params: {
    slug: string;
  };
};

export default function JobDetailRedirectPage({ params }: Props) {
  redirect(`/empleos/${params.slug}`);
}
