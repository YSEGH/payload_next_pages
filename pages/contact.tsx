import payload from "payload";
import React from "react";
import FormElement from "../components/Form";
import { FormState } from "../components/Form/types";
import { exo } from "../utilities/fonts";
import styles from "../css/pages/contact.module.css";
import cx from "classnames";
import Image from "next/image";
import Breadcrumb from "../components/Breadcrumb";

interface Infos {
  title: String;
  description: String;
}

type Form = {
  fields: any[];
  id: string;
  submitButtonLabel: string;
  title: string;
  confirmationMessage?: any;
};

interface Props {
  infos: Infos;
  form: Form;
}

const contact: React.FC<Props> = ({ infos, form }) => {
  const formState: FormState = {
    ...form,
    errors: [],
    success: false,
    loading: false,
    customClass: "form__contact",
    confirmationMessage: form.confirmationMessage[0].children[0].text,
  };
  return (
    <div className={cx(styles.page__contact)}>
      <div className={styles.hero_bannier}>
        <Image
          alt="Chloé Butterfly"
          src={`http://localhost:3000/media/photo_1-1024x576.png`}
          width={1024}
          height={576}
        />
      </div>
      <Breadcrumb />
      <div className={styles.form__container}>
        <div className={styles.text__container}>
          <h3 className={cx(styles.text__title, exo.className)}>
            {infos.title}
          </h3>
          <p className={cx(styles.text__description, exo.className)}>
            {infos.description}
          </p>
        </div>
        <FormElement form={formState} />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { contact } = await payload.findGlobal({
    slug: "infos",
  });
  const { docs: form } = await payload.find({
    collection: "forms",
    where: {
      title: { equals: "Contact" },
    },
  });

  return {
    props: {
      infos: contact,
      form: form[0],
    },
  };
}

export default contact;
