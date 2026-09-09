import { Link } from "@tanstack/react-router";
import { SiteChrome } from "./site-chrome";
import { GrokWorkforceLayers } from "./grok-workforce-layers";
import { fieldRecipes, type FieldRecipe } from "./field-guide-data";

function CrewRidge({ recipe }: { recipe: FieldRecipe }) {
  return (
    <article className="ac-recipe ac-fg-crew is-open" id={recipe.id}>
      <header className="ac-recipe-head">
        <span className="ac-recipe-num">{recipe.number}</span>
        <div className="ac-recipe-titles">
          <h2 className="ac-recipe-title">{recipe.title}</h2>
          <p className="ac-recipe-when">{recipe.when}</p>
        </div>
      </header>

      <GrokWorkforceLayers defaultOpen />

      <p className="ac-recipe-done">
        <span>Complete when</span>
        {recipe.doneWhen}
      </p>

      <p className="ac-fg-descent">
        <a className="ac-fg-descent-link" href="#name-the-problem">
          Return to Base Camp
        </a>
      </p>
    </article>
  );
}

function RecipeCard({ recipe }: { recipe: FieldRecipe }) {
  if (recipe.crew) return <CrewRidge recipe={recipe} />;

  return (
    <article className="ac-recipe" id={recipe.id}>
      <header className="ac-recipe-head">
        <span className="ac-recipe-num">{recipe.number}</span>
        <div className="ac-recipe-titles">
          <h2 className="ac-recipe-title">{recipe.title}</h2>
          <p className="ac-recipe-when">{recipe.when}</p>
        </div>
      </header>
      {recipe.steps.length > 0 ? (
        <ol className="ac-recipe-steps">
        {recipe.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      ) : null}
      <p className="ac-recipe-done">
        <span>Complete when</span>
        {recipe.doneWhen}
      </p>
    </article>
  );
}

export function FieldGuidePage() {
  return (
    <SiteChrome loginRedirect="/gnomah">
      <div className="ac-service-page ac-field-guide ac-page-top">
        <div className="ac-service-stack">
          <header className="ac-service-head">
            <span className="ac-service-kicker">Field guide</span>
            <div className="ac-fg-title-row">
              <h1 className="ac-service-title">Operating method</h1>
            </div>
            <div className="ac-service-lede-box">
              <p className="ac-service-lede ac-service-lede--last">
                Write the plan. Complete the work. Record results and return
                to the starting point.
              </p>
            </div>
          </header>

          <div className="ac-recipe-list">
            {fieldRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <p className="ac-field-guide-foot">
            <Link to="/start">Submit a Climb Note</Link>
            <span aria-hidden> · </span>
            <Link to="/climb-notes">Published notes</Link>
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
