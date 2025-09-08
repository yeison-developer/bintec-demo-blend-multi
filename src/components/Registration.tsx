'use client';

import { useForm } from 'react-hook-form';

interface RegistrationProps {
  userData: { name: string; email: string; position: string };
  setUserData: (data: { name: string; email: string; position: string }) => void;
  nextStep: () => void;
}

export default function Registration({ userData, setUserData, nextStep }: RegistrationProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: userData
  });

  const onSubmit = (data: { name: string; email: string; position: string }) => {
    setUserData(data);
    nextStep();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Grupo CIBest</h1>
        <p className="text-yellow-500">Powered by AWS</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Bienvenido</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            {...register('name', { required: 'Nombre es requerido' })}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input
            {...register('email', { required: 'Correo es requerido', pattern: { value: /^\S+@\S+$/, message: 'Correo inválido' } })}
            className="w-full p-2 border rounded"
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Cargo</label>
          <input
            {...register('position', { required: 'Cargo es requerido' })}
            className="w-full p-2 border rounded"
            type="text"
          />
          {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Iniciar experiencia
        </button>
      </form>
    </div>
  );
}
