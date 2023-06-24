import React from 'react'
import SideMenuOption from './SideMenuOption';
import './SideMenu.scss';
import Spacer from './Spacer';

function SideMenu() {
  const actions = [
    {
      name: 'Crear Reporte',
      link: 'create-report',
      icon: ''
    },
  ];
  const configurations = [
		{
			name: 'RS',
			link: 'snps',
			icon: '',
		},
		{
			name: 'Genotipos',
			link: 'genotypes',
			icon: '',
		},
		{
			name: 'Genotipos x RS',
			link: 'genotypes-by-snp',
			icon: '',
		},
		{
			name: 'Interpretaciones',
			link: 'interpretations',
			icon: '',
		},
		{
			name: 'Efectos en Genotipos',
			link: 'genotypes-effects',
			icon: '',
		},
  ];
  return (
    <div className="side-menu">
        <div className="side-menu-icon">
          <img src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png' alt="unigem-logo"/>
        </div>
        <Spacer text="Acciones">
          {actions.map(option => 
            <SideMenuOption 
              key={option.link} 
              name={option.name}
              link={option.link}
              icon={option.icon}
            />
          )}
        </Spacer>
      <Spacer text="Configuraciones">
        {configurations.map(option => 
          <SideMenuOption 
            key={option.link} 
            name={option.name}
            link={option.link}
            icon={option.icon}
          />
        )}
      </Spacer>
    </div>
  )
}

export default SideMenu