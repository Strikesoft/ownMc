# ownMc

[![devDependency Status](https://david-dm.org/Strikesoft/ownMc/dev-status.svg?style=flat-square)](https://david-dm.org/Strikesoft/ownMc#info=devDependencies)
[![Build Status](https://travis-ci.org/Strikesoft/ownMc.svg?branch=master)](https://travis-ci.org/Strikesoft/ownMc)

Your own media center

- GitHub project at [https://github.com/Strikesoft/ownMc](https://github.com/Strikesoft/ownMc)
- Released under the MIT license
- Authored by [Johann-S](https://github.com/Johann-S)

## Behat unit tests
[Behat](http://docs.behat.org/en/v3.0/) allows for [Behavior Driven Development](https://en.wikipedia.org/wiki/Behavior-driven_development) PHP integration.
Feature files are located in the [/features/](https://github.com/Strikesoft/ownMc/tree/master/features) folder and step definitions are located in the [FeatureContext.php](https://github.com/Strikesoft/ownMc/tree/master/features/bootstrap/FeatureContext.php) file.
Each new feature developed must be covered by a BDD feature file with the following beginning-of-file structure:
>Feature: Feature Name
>  In order to ...
>  As ...
>  I need ...

And the following scenario structure:
>Scenario: FeatureName - Action - ExpectedResult
>Given ...
>When ...

>Then ...

## Contributors
- [xfroelicher](https://github.com/xfroelicher)
- [guillaumesoul](https://github.com/guillaumesoul)
- [NicolasBRERO](https://github.com/NicolasBRERO)
