/**
 * Protege o React contra extensões e tradutores (Google Tradutor do Chrome)
 * que substituem text nodes diretamente no DOM.
 *
 * Quando isso acontece, o React tenta remover/mover nós que já não são mais
 * filhos do pai que ele registrou e lança:
 *   NotFoundError: Failed to execute 'removeChild' on 'Node'
 * derrubando a árvore inteira e deixando a tela branca.
 *
 * Referência: https://github.com/facebook/react/issues/11538
 */
export function instalarProtecaoContraTradutor(): void {
  if (typeof Node !== 'function' || !Node.prototype) return;

  const removeChildOriginal = Node.prototype.removeChild;
  Node.prototype.removeChild = function removeChildSeguro<T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn('removeChild ignorado: no nao pertence mais a este pai', child, this);
      }
      return child;
    }
    return removeChildOriginal.call(this, child) as T;
  };

  const insertBeforeOriginal = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function insertBeforeSeguro<T extends Node>(
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn(
          'insertBefore ajustado: referencia nao pertence a este pai',
          referenceNode,
          this,
        );
      }
      return this.appendChild(newNode) as T;
    }
    return insertBeforeOriginal.call(this, newNode, referenceNode) as T;
  };
}
