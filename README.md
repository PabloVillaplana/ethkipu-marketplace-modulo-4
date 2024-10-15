# VitalikPlace: SmartContract de Marketplace de NFTs

## Descripción

VitalikPlace es un Marketplace de NFTs descentralizado construido en Ethereum. Permite a los usuarios listar, comprar, deslistar y actualizar los precios de sus NFTs. El contrato proporciona una forma segura y transparente de comerciar tokens ERC721.

### Características Principales:
- Listar NFTs para la venta
- Comprar NFTs listados
- Deslistar NFTs
- Actualizar precios de NFTs listados
- Ver precios de NFTs listados

### Tecnologías utilizadas:
- **Smart Contracts:** Solidity
- **Entorno de Desarrollo:** Foundry
- **Front-end:** React + Wagmi
- **Tests:** Pruebas unitarias con Foundry

## Fundamentos del Diseño y Patrones de Diseño del Smart contract en Solidity

### 1. Reentrancy Guard

Hemos implementado el `ReentrancyGuard` de OpenZeppelin para proteger contra ataques de reentrada. Esto es crucial para funciones que involucran transferencias de Ether o tokens.

```solidity
contract VitalikPlace is ReentrancyGuard {
    // ...
}
```

**Patrón Utilizado**: Reentrancy Guard
**Razón**: Previene que contratos maliciosos vuelvan a entrar en el contrato durante cambios de estado, mejorando la seguridad.

### 2. Patrón Checks-Effects-Interactions

En funciones como `buyNFT`, seguimos el patrón Checks-Effects-Interactions:

1. Comprobar condiciones
2. Actualizar estado
3. Interactuar con contratos externos

**Patrón Utilizado**: Checks-Effects-Interactions
**Razón**: Minimiza el riesgo de ataques de reentrada y asegura un flujo claro y lógico de operaciones.

### 3. Emisión de Eventos

Emitimos eventos para todos los cambios de estado significativos:

**Patrón Utilizado**: Event Emission
**Razón**: Permite un seguimiento eficiente fuera de la cadena de los cambios de estado del contrato y proporciona una pista de auditoría clara.

### 4. Access Control

Usamos comprobaciones simples de control de acceso para asegurar que solo usuarios autorizados puedan realizar ciertas acciones:

**Patrón Utilizado**: Access Control
**Razón**: Asegura que solo el propietario legítimo de un NFT pueda modificar su listado o precio.

## Pruebas Unitarias

Hemos implementado un conjunto completo de pruebas unitarias utilizando el framework de testing de Foundry para asegurar la robustez y correcto funcionamiento de nuestro smart contract. A continuación, se describen tres pruebas clave que verifican las funcionalidades de "Listar NFTs para la venta" y "Actualizar precios de NFTs listados":

### 1. Listar un NFT para la venta exitosamente

Esta prueba verifica que un usuario pueda listar correctamente un NFT para la venta en el marketplace.

### 2. Actualizar el precio de un NFT listado

Esta prueba verifica que el propietario de un NFT listado pueda actualizar su precio correctamente.

### 3. Prevenir la actualización de precio por una dirección no autorizada

Esta prueba verifica que solo el propietario del NFT listado pueda actualizar su precio, previniendo actualizaciones no autorizadas.

### Interfaz Front-end

La interfaz de usuario de VitalikPlace está construida con React y utiliza la biblioteca wagmi para una integración fluida con wallets y contratos de Ethereum. Esto proporciona una experiencia de usuario atractiva y fácil de usar para interactuar con el marketplace.

### Integrantes: 
- [Juan Pablo Villaplana](https://github.com/PabloVillaplana)
- [Diana Novoa](https://github.com/nov0ax)
- [Anouk Rímola](https://github.com/AnoukRImola)
