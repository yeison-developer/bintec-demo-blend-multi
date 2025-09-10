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
    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-2">
          <img src="/images/Bintec.webp" alt="Bintec" className="h-8 mr-2"/>
          <span className="text-lg font-bold text-gray-800">x</span>
          <img src="/images/Blend360.webp" alt="Blend360" className="h-8 ml-2"/>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-sm text-gray-600 mr-2">Powered by</span>
          <img src="/images/Logo-AWS-smile.webp" alt="AWS" className="h-6"/>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Bienvenido</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            {...register('name', { required: 'Nombre es requerido' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="text"
            placeholder="Juan Sebastian Hoyos Mesa"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo</label>
          <input
            {...register('email', { required: 'Correo es requerido', pattern: { value: /^\S+@\S+$/, message: 'Correo inválido' } })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="email"
            placeholder="juansebas1307@gmail.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
          <input
            {...register('position', { required: 'Cargo es requerido' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            type="text"
            placeholder="Gerente Comercial"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-900 to-orange-500 text-white p-3 rounded-lg hover:from-blue-800 hover:to-orange-600 font-medium transition-colors shadow-md hover:shadow-lg"
        >
          Iniciar experiencia
        </button>
      </form>
    </div>
  );
}
