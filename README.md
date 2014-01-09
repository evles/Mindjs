Mindjs
======

The mindjs framework is a HTML5-oriented, compact, high efficiency JavaScript library which realizes the HTML5<canvas> animation in terms of function. It can be used to achieve a HTML document operation, and especially encapsulates for the HTML5<canvas> element the graphics rendering, animation and other control ability. The framework has good encapsulation, expansibility and usability.

The mindjs encapsulates four objects, Dom objects, Canvas objects, Entity objects, Animation objects.
The mindjs on the Dom object encapsulates the method for operation of DOM and canvas to create a Canvas object in the Dom () method on the object.
The Canvas object is a piece of canvas, the Canvas object encapsulates the properties of some Canvas objects and methods to create an entity () in the picture on Canvas objects,
The entity object created by the entity method in the Canvas object is an Entity object, which is actually a specific element in a picture. For example, there are trees and birds in a picture; we can create two Entity objects, one for painting the tree, one for painting a bird. The Entity object encapsulates some methods to change the state of the Entity object, and the most important Entity object encapsulates an animation method, which will convert an Entity object into an Animation object.
  The Entity object is converted into an Animation object, and the Animation object encapsulates methods to achieve animation. So we can do some good animation processing to the Entity object.
	
The mindjs framework uses the symbol “$” as his alias, and the “$” symbol encapsulates selector to determine the data type, loading picture resources, extension method and etc. The $ sign’s functions are basically the same with the currently popular JavaScript libraries.
In the mindjs, $('selector') is the selector to select the object. The selector can select Dom object, Canvas object and Entity object.
$('css3 selector’) can select the Dom object; $('$+Canvas object name') can choose to create a Canvas object. $ inside selector is the special Canvas object identity identifier, used to say that this is in the choice of a Canvas object, different from the alias $ of the framework; $('$+Canvas object name+@Entity object name') can select the Entity object. @ inside the selector is the special Entity identity identifier which is used in the choice of a Entity object.

